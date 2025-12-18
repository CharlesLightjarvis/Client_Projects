<?php

namespace App\Exceptions;

use Exception;

class ExamTimeExpiredException extends Exception
{
    public function __construct(string $message = "Exam time has expired", int $code = 422, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}