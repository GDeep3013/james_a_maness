<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\VehicleDocument;
use App\Models\Vehical;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Auth;

class VehicleDocumentController extends Controller
{
    public function index(Request $request)
    {
        try {
            $vehicleId = $request->vehicle_id;
            
            if (!$vehicleId) {
                return response()->json(['status' => false, 'message' => 'Vehicle ID is required'], 400);
            }

            $query = VehicleDocument::where('vehicle_id', $vehicleId)->orderBy('created_at', 'desc');

            if (!empty($request->page)) {
                $documents = $query->paginate(10);
                return response()->json(['status' => true, 'documents' => $documents]);
            } else {
                $documents = $query->get();
                return response()->json(['status' => true, 'documents' => $documents]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetching documents.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'vehicle_id' => 'required|exists:vehicals,id',
                'title' => 'required|string|max:255',
                'file' => 'required|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif,webp|max:10240',
                'expires_date' => 'nullable|date',
            ]);

            $vehicle = Vehical::find($validatedData['vehicle_id']);
            if (!$vehicle) {
                return response()->json(['status' => false, 'message' => 'Vehicle not found'], 404);
            }

            $file = $request->file('file');
            if ($file && $file->isValid()) {
                $fileName = time() . '_' . uniqid() . '.' . $file->extension();
                $filePath = 'vehicle-documents/' . $fileName;
                
                if (!File::exists(public_path('vehicle-documents'))) {
                    File::makeDirectory(public_path('vehicle-documents'), 0755, true);
                }

                $file->move(public_path('vehicle-documents'), $fileName);
                chmod(public_path('vehicle-documents/' . $fileName), 0644);

                $document = new VehicleDocument;
                $document->vehicle_id = $validatedData['vehicle_id'];
                $document->title = $validatedData['title'];
                $document->file_path = $filePath;
                $document->file_name = $fileName;
                $document->file_type = $file->getClientOriginalExtension();
                $document->expires_date = $request->expires_date ?? null;

                if ($document->save()) {
                    return response()->json([
                        'status' => true,
                        'message' => 'Document uploaded successfully',
                        'data' => $document
                    ]);
                } else {
                    if (File::exists(public_path('vehicle-documents/' . $fileName))) {
                        File::delete(public_path('vehicle-documents/' . $fileName));
                    }
                    return response()->json(['status' => false, 'message' => 'Failed to save document'], 500);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Invalid file'], 422);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while uploading the document.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $document = VehicleDocument::with('vehicle')->find($id);
            if ($document) {
                $document->file_url = asset($document->file_path);
                return response()->json(['status' => true, 'document' => $document]);
            } else {
                return response()->json(['status' => false, 'message' => 'Document not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while fetching the document.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $document = VehicleDocument::find($id);
            if (!$document) {
                return response()->json(['status' => false, 'message' => 'Document not found'], 404);
            }

            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'file' => 'nullable|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png,gif,webp|max:10240',
                'expires_date' => 'nullable|date',
            ]);

            $oldFileName = $document->file_name;

            if ($request->hasFile('file')) {
                $file = $request->file('file');
                if ($file->isValid()) {
                    if ($oldFileName && File::exists(public_path('vehicle-documents/' . $oldFileName))) {
                        File::delete(public_path('vehicle-documents/' . $oldFileName));
                    }

                    $fileName = time() . '_' . uniqid() . '.' . $file->extension();
                    $filePath = 'vehicle-documents/' . $fileName;
                    
                    $file->move(public_path('vehicle-documents'), $fileName);
                    chmod(public_path('vehicle-documents/' . $fileName), 0644);

                    $document->file_path = $filePath;
                    $document->file_name = $fileName;
                    $document->file_type = $file->getClientOriginalExtension();
                }
            }

            $document->title = $validatedData['title'];
            $document->expires_date = $request->expires_date ?? null;

            if ($document->save()) {
                return response()->json([
                    'status' => true,
                    'message' => 'Document updated successfully',
                    'data' => $document
                ]);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to update document'], 500);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while updating the document.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $document = VehicleDocument::find($id);
            if (!$document) {
                return response()->json(['status' => false, 'message' => 'Document not found'], 404);
            }

            $fileName = $document->file_name;
            if ($fileName && File::exists(public_path('vehicle-documents/' . $fileName))) {
                File::delete(public_path('vehicle-documents/' . $fileName));
            }

            if ($document->delete()) {
                return response()->json(['status' => true, 'message' => 'Document deleted successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to delete document'], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred while deleting the document.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
