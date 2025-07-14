<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class BoardController extends Controller
{
    public static function index(){
        $user = auth() -> user();
        $boards = $user -> boards;
        return response() -> json([
            $boards
        ]);
    }

    public static function show($id){
        $user = auth() -> user();

        //Buscar board
        $board = Board::with('task_lists.tasks')->find($id);
        if(!$board){
            return redirect()-> route("home");
        }

        //Validar que el tablero sea del usuario
        if($board){
            if($board['user_id'] != $user['id']){
                return redirect("/");
            }
        }
        

        //Obtener tableros
        $boards = $user -> boards;
        
        return Inertia::render('dashboard',[
            'boards' => $boards,
            'board' => $board
        ]);
    }

    public static function store(Request $request){
        $request -> validate([
            'name' => 'required|min:3|max:30'
        ],[
            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener mínimo 3 caracteres',
            'name.max' => 'El nombre debe tener máximo 30 caracteres'
        ]);

        $user = auth() -> user();
        $board = Board::create([
            'user_id' => $user['id'],
            'name' => $request['name']
        ]);

        return response() -> json([
            'message' => 'Tablero creado correctamente',
            'board' => $board
        ]);
    }

    public static function update(Board $board, Request $request){
        $user = auth() -> user();
        //Validar que sea del usuario
        if($board['user_id'] != $user['id']){
          return response() -> json([
                'message' => 'El tablero no pertenece al usuario'
            ],401);
        }

        $request -> validate([
            'name' => 'required|min:3|max:30'
        ],[
            'name.required' => 'El nombre es obligatorio',
            'name.min' => 'El nombre debe tener mínimo 3 caracteres',
            'name.max' => 'El nombre debe tener máximo 30 caracteres'
        ]);

        $board['name'] = $request['name'];
        $board -> save();

        return response() -> json([
            'message' => 'Tablero actualizado correctamente',
            'board' => $board
        ]);
    }

    public static function destroy(Board $board){
        $user = auth() -> user();
        //Validar que sea del usuario
        if($board['user_id'] != $user['id']){
          return response() -> json([
                'message' => 'El tablero no pertenece al usuario'
            ],401);
        }


        
        $board -> delete();

        return response() -> json([
            'message' => 'Tablero eliminado correctamente'
        ]);
    }
}
