<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TaskList;
use Illuminate\Http\Request;

class TaskListController extends Controller
{
    public static function index (Request $request){


    }

    public static function store(Request $request){
        //Validar formulario
        $request -> validate([
            'name' => 'required|min:3|max:30'
        ],[
            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener mínimo 3 caracteres',
            'name.max' => 'El nombre debe tener máximo 30 caracteres'
        ]);

        //Crear lista
        $taskList = TaskList::create([
            'board_id' => $request['board_id'],
            'name' => $request['name'],            
        ]);

        $taskList['tasks'] = [];

        return response() -> json([
            'taskList' => $taskList
        ]);
    }
    
    public static function update(TaskList $taskList, Request $request){
        $user = auth() -> user();
        $board = $taskList -> board;

        //Validar que sea del usuario
        if($board['user_id'] != $user['id']){
            return response() -> json([
                'message' => 'La lista no pertenece al usuario'
            ],401);
        }

        //Validar formulario
        $request -> validate([
            'name' => 'required|min:3|max:30',
            'description' => 'nullable|min:3|max:200'
        ],[
            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener mínimo 3 caracteres',
            'name.max' => 'El nombre debe tener máximo 30 caracteres',
            'description.min' => 'La descripción debe tener mínimo 3 caracteres',
            'description.max' => 'La descripción debe tener máximo 200 caracteres',
        ]);

        //Actualizar

        $taskList['name'] = $request['name'];
        $taskList['description'] = $request['description'];
        $taskList -> save();

        return response() -> json([
            'message' => 'Lista actulizada'
        ]);
    }
    
    public static function destroy(TaskList $taskList){
        $user = auth() -> user();
        $board = $taskList -> board;

        //Validar que sea del usuario
        if($board['user_id'] != $user['id']){
            return response() -> json([
                'message' => 'La lista no pertenece al usuario'
            ],401);
        }

        $taskList -> delete();
        return response() -> json([
            'message' => 'Lista eliminada'
        ]);
    }
}
