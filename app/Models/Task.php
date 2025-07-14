<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'task_list_id',
        'title',
        'description',
        'complete'
        ];

    protected $casts = [
        'complete' => 'boolean',
    ];


    public function task_list(){
        return $this->belongsTo(TaskList::class);
    }
}
