<?php

namespace App\Http\Services\V1;

use App\Enums\PaymentStatusEnum;
use App\Http\Resources\v1\PaymentResource;
use App\Models\Payment;
use App\Models\FormationSession;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    public function getAllPayments()
    {
        return PaymentResource::collection(
            Payment::with(['student', 'session.formation'])->get()
        );
    }

    public function getStudentPayments($studentId)
    {
        return PaymentResource::collection(
            Payment::with(['session.formation'])
                ->where('student_id', $studentId)
                ->orderBy('payment_date', 'desc')
                ->get()
        );
    }

    public function createPayment($data)
    {
        try {
            DB::beginTransaction();

            $session = FormationSession::with('formation')->findOrFail($data['session_id']);
            $formation = $session->formation;
            
            // Vérifier si l'étudiant est inscrit à cette session
            $isEnrolled = $session->students()->where('id', $data['student_id'])->exists();
            
            if (!$isEnrolled) {
                Log::error("L'étudiant n'est pas inscrit à cette session", [
                    'student_id' => $data['student_id'],
                    'session_id' => $data['session_id']
                ]);
                throw new \Exception("L'étudiant n'est pas inscrit à cette session");
            }
            
            // Si la session a un prix spécifique, utilisez-le, sinon utilisez le prix de la formation
            $sessionPrice = $session->price ?? $formation->price;
            
            $existingPayments = Payment::where('student_id', $data['student_id'])
                ->where('session_id', $data['session_id'])
                ->sum('amount');

            $remainingAmount = $sessionPrice - ($existingPayments + $data['amount']);

            $status = $remainingAmount <= 0 ? PaymentStatusEnum::COMPLETED->value : PaymentStatusEnum::PARTIAL->value;

            Payment::create([
                ...$data,
                'remaining_amount' => max(0, $remainingAmount),
                'status' => $status
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de la création du paiement: ' . $e->getMessage(), [
                'data' => $data,
                'exception' => $e
            ]);
            return false;
        }
    }

    public function getPaymentDetails($id)
    {
        return new PaymentResource(
            Payment::with(['student', 'session.formation'])->findOrFail($id)
        );
    }

    public function updatePayment($id, $data)
    {
        try {
            DB::beginTransaction();

            $payment = Payment::find($id);
            if (!$payment) {
                return false;
            }

            $session = FormationSession::with('formation')->findOrFail($data['session_id'] ?? $payment->session_id);
            $formation = $session->formation;
            
            // Si la session a un prix spécifique, utilisez-le, sinon utilisez le prix de la formation
            $sessionPrice = $session->price ?? $formation->price;

            // Calculate total payments excluding current payment
            $existingPayments = Payment::where('student_id', $data['student_id'] ?? $payment->student_id)
                ->where('session_id', $data['session_id'] ?? $payment->session_id)
                ->where('id', '!=', $id)
                ->sum('amount');

            // Add new amount if provided, otherwise use existing amount
            $totalAmount = $existingPayments + ($data['amount'] ?? $payment->amount);

            $remainingAmount = $sessionPrice - $totalAmount;
            $status = $remainingAmount <= 0 ? PaymentStatusEnum::COMPLETED->value : PaymentStatusEnum::PARTIAL->value;

            $payment->update([
                ...$data,
                'remaining_amount' => max(0, $remainingAmount),
                'status' => $status
            ]);

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    public function deletePayment($id)
    {
        try {
            DB::beginTransaction();

            $payment = Payment::find($id);
            if (!$payment) {
                return false;
            }

            $payment->delete();

            DB::commit();
            return true;
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }
}