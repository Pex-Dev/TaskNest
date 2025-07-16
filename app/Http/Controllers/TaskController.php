<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public static function index(Request $request ){
        Task::create([
            'name' => 'nueva lista',
            'description' => 'mish'
        ]);

        return redirect()->back();
    }

    public static function store(Request $request){
        //Buscar taskList
        $taskList = TaskList::with('board')->find($request['task_list_id']);
        if(!$taskList){
            return response() -> json(['message' => 'Lista no encontrada' ],404);
        }
        
        $userId = auth()->id();

        //Validar que sea del usuario
        if($taskList -> board['user_id'] != $userId){
            return response() -> json(['message' => 'Lista no corresponse al usuario' ],401);
        }

        //Validar task
        $request -> validate([
            'title' => 'required|min:3|max:100'
        ],[
            'title.required' => 'El título es obligatorio',
            'title.min' => 'El título debe tener mínimo 3 caracteres',
            'title.max' => 'El título debe tener máximo 100 caracteres',
        ]); 
        
        $task = Task::create([
            'task_list_id' => $taskList['id'],
            'title' => $request['title'],
            'description' => null,
            'complete' => false
        ]);

        return response() -> json(['task' => $task]);
    }

    public static function update(Request $request){
        //Buscar Task
        $task = Task::find($request['id']);

        if(!$task || $task -> taskList -> user_id != auth()->id){
            return back()->withErrors(['message' => 'Tarea no encontrada o no pertenece al usuario']);
        }       
    }

    public static function destroy(Task $task){
        $userId = auth()->id();

        $taskList = $task -> task_list;
        
        //Validar que sea del usuario
        if($taskList -> board['user_id'] != $userId){
            return response() -> json(['message' => 'Lista no corresponse al usuario' ],401);
        }

        $task -> delete();
        return response() -> json([
            'message' => 'Tarea eliminada'
        ]);
    }

    public static function toggleComplete(Task $task){
        $userId = auth()->id();

        $taskList = $task -> task_list;

        //Validar que sea del usuario
        if($taskList -> board['user_id'] != $userId){
            return response() -> json(['message' => 'Lista no corresponse al usuario' ],401);
        }

        //Cambiar el campo complete
        $task['complete'] = !$task['complete'];
        $task -> save();


        return response()->json([
            'status' => 'ok',
            'complete' => $task->complete
        ]);
    }
}
