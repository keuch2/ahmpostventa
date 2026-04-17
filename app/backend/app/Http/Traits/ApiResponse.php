<?php

namespace App\Http\Traits;

trait ApiResponse
{
    protected function success($data, $message = 'OK', $code = 200)
    {
        return response()->json(['success' => true, 'data' => $data, 'message' => $message], $code);
    }

    protected function error($message, $errors = [], $code = 422)
    {
        return response()->json(['success' => false, 'message' => $message, 'errors' => $errors], $code);
    }
}
