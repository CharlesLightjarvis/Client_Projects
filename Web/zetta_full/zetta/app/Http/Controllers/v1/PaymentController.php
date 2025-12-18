<?php

namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\v1\Payment\StorePaymentRequest;
use App\Http\Requests\v1\Payment\UpdatePaymentRequest;
use App\Http\Services\V1\PaymentService;
use App\Trait\ApiResponse;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    use ApiResponse;

    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function index()
    {
        $payments = $this->paymentService->getAllPayments();
        return $this->successResponse('Payments retrieved successfully', 'payments', $payments);
    }

    public function store(StorePaymentRequest $request)
    {
        $isCreated = $this->paymentService->createPayment($request->validated());
        if ($isCreated) {
            return $this->successNoData('Payment recorded successfully');
        }
        return $this->errorResponse('Failed to record payment', 400);
    }

    public function show($id)
    {
        $payment = $this->paymentService->getPaymentDetails($id);
        return $this->successResponse('Payment details retrieved successfully', 'payment', $payment);
    }

    public function update(UpdatePaymentRequest $request, $id)
    {
        $is_updated = $this->paymentService->updatePayment($id, $request->validated());
        if ($is_updated) {
            return $this->successNoData('Payment updated successfully');
        }
        return $this->errorResponse('Payment not found or cannot be updated', 400);
    }

    public function destroy($id)
    {
        $is_deleted = $this->paymentService->deletePayment($id);
        if ($is_deleted) {
            return $this->successNoData('Payment deleted successfully');
        }
        return $this->errorResponse('Payment not found', 404);
    }

    public function studentPayments()
    {
        $studentId = Auth::id();
        $payments = $this->paymentService->getStudentPayments($studentId);
        return $this->successResponse('Student payments retrieved successfully', 'payments', $payments);
    }
}
