<?php

namespace App\Exceptions;

use Exception;

class InsufficientQuestionsException extends Exception
{
    public function __construct(string $message = "Insufficient questions available for exam generation", int $code = 422, Exception $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}