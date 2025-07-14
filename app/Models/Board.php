<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    protected $fillable = [
        'user_id',
        'name'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function task_lists(){
        return $this->hasMany(TaskList::class);
    }
}
