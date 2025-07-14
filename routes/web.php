<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskListController;
use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/', function () {
        $user = auth() -> user();
       

        //Obtener tableros
        $boards = $user -> boards;
        
        return Inertia::render('dashboard',[
            'boards' => $boards,
            'board' => null
        ]);
    })->name('home');   

    

    Route::get('/boards',[BoardController::class, 'index']);
    Route::get('/boards/{id}',[BoardController::class, 'show']);
    Route::post('/boards',[BoardController::class, 'store']);
    Route::put('/boards/{board}',[BoardController::class, 'update']);
    Route::delete('/boards/{board}',[BoardController::class, 'destroy']);

    Route::post('/task-list',[TaskListController::class, 'store']);    
    Route::put('/task-list/{taskList}',[TaskListController::class,'update']);
    Route::delete('/task-list/{taskList}',[TaskListController::class, 'destroy']);

    Route::post('/task',[TaskController::class, 'store']) -> name('task.store');
    Route::put('/task/{task}/toggle',[TaskController::class, 'toggleComplete']) -> name('task.complete');
    Route::delete('/task/{task}',[TaskController::class,'destroy']) -> name('task.delete');
});

Route::get('/local', function () {

        $user = auth() -> user();

        if($user){
            return redirect("/");
        }

        return Inertia::render('dashboard-local',[
            'boards' => [],
            'board' => null
        ]);
    });

Route::get('/test-url', function () {
    dd(url('login'));
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
