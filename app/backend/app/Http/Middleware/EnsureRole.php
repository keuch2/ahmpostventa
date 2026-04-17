<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!in_array($request->user()?->role, $roles)) {
            return response()->json(['success' => false, 'message' => 'No autorizado.'], 403);
        }
        return $next($request);
    }
}
