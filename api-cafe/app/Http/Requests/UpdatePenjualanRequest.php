<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePenjualanRequest extends FormRequest
{
   public function authorize(): bool
{
    return true; // Ubah jadi true!
}

public function rules(): array
{
    return [
        'jumlah' => 'required|integer|min:1',
    ];
}
}
