<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reminder;
use Auth;
use Illuminate\Support\Facades\Schema;
use App\Mail\ReminderMail;
use Illuminate\Support\Facades\Mail;

class ReminderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $tableColumns = Schema::getColumnListing('reminders');
        $query = Reminder::with('driver', 'insurance');
        $searchTerm = $request->search;
        $rstatus = $request->status != "null" ? $request->status : "Pending";

        $query->where(function ($query) use ($tableColumns, $searchTerm) {
            foreach ($tableColumns as $column) {
                if ($column !== 'created_at' && $column !== 'updated_at') {
                    $query->orWhere($column, 'LIKE', '%' . $searchTerm . '%');
                }
            }
        });
        if (!empty($request->page) && $request->page !== "page") {
            $reminder = $query->where('status', $rstatus)->orderBy('id', 'desc')->paginate(50);
            if ($reminder) {
                return response()->json(['status' => true, 'reminder' => $reminder]);
            } else {
                return response()->json(['status' => false, 'message' => "Reminder data not found"]);
            }
        } else if ($request->page === "page") {
            $reminder = $query->where('status', 'Pending')->orderBy('id', 'desc')->paginate(10);
            if ($reminder) {
                return response()->json(['status' => true, 'reminder' => $reminder]);
            } else {
                return response()->json(['status' => false, 'message' => "Reminder data not found"]);
            }
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request->all());
        try {
            $validatedData = $request->validate([
                'type_of_reminder' => 'required',
                'days_before' => 'required',
            ]);
            $reminder = new Reminder;
            $reminder->user_id = Auth::user()->id;
            $reminder->vehicle_id = $request->vehicle_id ?? null;
            $reminder->driver_id = $request->driver_id ?? null;
            $reminder->insurance_id = $request->insurance_id ?? null;
            $reminder->driver_reminder = $request->driver_reminder ?? null;
            $reminder->vehicle_vin_no = $request->vehicle_vin_no ?? null;
            $reminder->truck = $request->truck ?? null;
            $reminder->tires = $request->tires ? 1 : 0;
            $reminder->brakes = $request->brakes ? 1 : 0;
            $reminder->lights = $request->lights ? 1 : 0;
            $reminder->windshield = $request->windshield ? 1 : 0;
            $reminder->wipers = $request->wipers ? 1 : 0;
            $reminder->mirrors = $request->mirrors ? 1 : 0;
            $reminder->seatbelts = $request->seatbelts ? 1 : 0;
            $reminder->steering = $request->steering ? 1 : 0;
            $reminder->suspension = $request->suspension ? 1 : 0;
            $reminder->expire_date = $request->expire_date;
            // =
            //  match ($validatedData['type_of_reminder']) {
            //     "Safety" => $request->expire_date,
            //     "Others" => $request->other_date,
            //     default => null,
            // };
            $reminder->days_before = $validatedData['days_before'];
            $reminder->notify_day = $request->days;
            $reminder->document_type = $validatedData['type_of_reminder'];
            $reminder->email_status = $request->email_check ? 1 : 0;
            $reminder->email = $request->email;
            $reminder->cc_email = $request->email_cc;
            $reminder->bcc_email = $request->email_bcc;
            $reminder->sms_status = $request->sms_check ? 1 : 0;
            $reminder->phone = $request->phone;
            $reminder->status = "Pending";
            $reminder->comments = $request->comments ?? null;
            if ($reminder->save()) {
                return response()->json(['status' => true, 'message' => 'Reminder data save successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Failed to save reminder data']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 401);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        if (!empty($id)) {
            $reminder = Reminder::with('driver', 'insurance')->where('id', $id)->first();
            if ($reminder) {
                return response()->json(['status' => true, 'reminder' => $reminder]);
            } else {
                return response()->json(['status' => false, 'message' => "Reminder data not found"]);
            }
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'type_of_reminder' => 'required',
                'days_before' => 'required',
            ]);
            $reminder = Reminder::find($id);
            if ($reminder) {
                $reminder->user_id = Auth::user()->id;
                $reminder->vehicle_id = $request->vehicle_id ?? null;
                $reminder->driver_id = $request->driver_id ?? null;
                $reminder->insurance_id = $request->insurance_id ?? null;
                $reminder->driver_reminder = $request->driver_reminder ?? null;
                $reminder->vehicle_vin_no = $request->vehicle_vin_no ?? null;
                $reminder->truck = $request->truck ?? null;
                $reminder->tires = $request->tires ? 1 : 0;
                $reminder->brakes = $request->brakes ? 1 : 0;
                $reminder->lights = $request->lights ? 1 : 0;
                $reminder->windshield = $request->windshield ? 1 : 0;
                $reminder->wipers = $request->wipers ? 1 : 0;
                $reminder->mirrors = $request->mirrors ? 1 : 0;
                $reminder->seatbelts = $request->seatbelts ? 1 : 0;
                $reminder->steering = $request->steering ? 1 : 0;
                $reminder->suspension = $request->suspension ? 1 : 0;
                $reminder->expire_date = $request->expire_date;
                // $reminder->expire_date = $reminder->expire_date = $reminder->expire_date = match ($validatedData['type_of_reminder']) {
                //     "Safety" => $request->expire_date,
                //     "Others" => $request->other_date,
                //     default => null,
                // };
                $reminder->days_before = $validatedData['days_before'];
                $reminder->notify_day = $request->days;
                $reminder->document_type = $validatedData['type_of_reminder'];
                $reminder->email_status = $request->email_check ? 1 : 0;
                $reminder->email = $request->email;
                $reminder->cc_email = $request->email_cc;
                $reminder->bcc_email = $request->email_bcc;
                $reminder->sms_status = $request->sms_check ? 1 : 0;
                $reminder->phone = $request->phone;
                $reminder->comments = $request->comments ?? null;
                if ($reminder->save()) {
                    return response()->json(['status' => true, 'message' => 'Reminder data update successfully']);
                } else {
                    return response()->json(['status' => false, 'message' => 'Failed to update reminder data']);
                }
            } else {
                return response()->json(['status' => false, 'message' => 'Reminder data not found']);
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['status' => 'error', 'errors' => $e->validator->errors()], 401);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if (!empty($id)) {
            $reminder = Reminder::find($id);
            if ($reminder->delete()) {
                return response()->json(['status' => true, 'message' => 'Reminder delete successfully']);
            } else {
                return response()->json(['status' => false, 'message' => 'Reminder not found']);
            }
        }
    }
    private function generateReminderMessage($expireDate, $reminderType) {
        // $expireDate = $mailData['expire_date'];
        // $reminderType = $mailData['reminder_type'];
    
        switch ($reminderType) {
            case 'permit':
                return "Your International Driving Permit (IDP) will expire on {$expireDate}. Please renew it promptly.";
            case 'health':
                return "Your Health Insurance will expire on {$expireDate}. Please renew it promptly.";
            case 'permit_renewal':
                return "Your Work Permit Renewal is due on {$expireDate}. Please renew it promptly.";
            case 'medical':
                return "Your Medical Fitness certificate will expire on {$expireDate}. Please renew it promptly.";
            default:
                return "A document or item is set to expire on {$expireDate}. Please address this promptly.";
        }
    }

    public function sendReminderMail()
    {
        $reminderData = Reminder::with('driver', 'insurance.vehicle', 'vehicle')->where('status', 'Pending')->get();
        // dd($reminderData->toArray());
        $currentDate = date('Y-m-d');
        if ($reminderData) {
            foreach ($reminderData as $reminder) {
                // dump($reminder->toArray());
                if ($reminder->insurance !== null && ($reminder->document_type === "Insurance")) {
                    $originalDate = new \DateTime($reminder->expire_date);
                    $daysBefore = (clone $originalDate)->modify('-' . $reminder->days_before . ' ' . $reminder->notify_day)->format('Y-m-d');
                    if ($currentDate <= $daysBefore) {
                        if ($reminder->email_status === 1) {
                            $mailData = [
                                'title' => 'Mail From Shiva Transport',
                                'name' => $reminder->insurance->insured_name,
                                'type' => $reminder->document_type,
                                'expire_date' => $reminder->expire_date,
                                'policy_no' => $reminder->insurance->policy_no,
                                // 'vehicle' => implode(", ", [$reminder->insurance->vehicle->make, $reminder->insurance->vehicle->model, $reminder->insurance->vehicle->year]),
                                'logo_image' => base64_encode(file_get_contents(public_path('/assets/img/logo_new.png'))),
                                'message' => $reminder->comments,
                                'vehicle_vin_no' => $reminder->vehicle_vin_no,
                                'reminder_type' => $reminder->driver_reminder ?? "",
                                'truck' => $reminder->insurance->vehicle->truck,
                            ];
                            $mail = new ReminderMail($mailData);
                            if (!empty($reminder->cc_email)) {
                                 $mail->cc("sahil610weblab@gmail.com");
                            }
                            // if (!empty($reminder->bcc_email)) {
                            //     $mail->bcc($reminder->bcc_email);
                            // }
                            Mail::to("ankit.610weblab@gmail.com")->send($mail);
                            $reminder->status = "Completed";
                            $reminder->save();
                        }
                    }
                    // dd($reminder->toArray(), $reminder->insurance->end_date, $daysBefore);
                } else if ($reminder->driver !== null && $reminder->document_type === "Driver") {
                    $originalDate = new \DateTime($reminder->expire_date);
                    $formattedDate = $originalDate->format('Y-m-d');
                    $daysBefore = (clone $originalDate)->modify('-' . $reminder->days_before . ' ' . $reminder->notify_day)->format('Y-m-d');
                    if ($currentDate <= $daysBefore  || $currentDate === $formattedDate) {
                        if ($reminder->email_status === 1) {
                            $mailData = [
                                'title' => 'Mail From Shiva Transport',
                                'name' => $reminder->driver->first_name . ' ' . $reminder->driver->last_name,
                                'type' => $reminder->document_type,
                                'expire_date' => $reminder->expire_date,
                                'license_no' => $reminder->driver->license_no,
                                'license_class' => $reminder->driver->license_class,
                                'message' => $reminder->comments,
                                'reminder_type' => $reminder->driver_reminder,
                                'reminder_msg'=> $this->generateReminderMessage($reminder->expire_date, $reminder->driver_reminder),
                                'truck' => ""
                                
                            ];

                            $mail = new ReminderMail($mailData);
                            if (!empty($reminder->cc_email)) {
                                 $mail->cc("sahil610weblab@gmail.com");
                            }
                            // if (!empty($reminder->bcc_email)) {
                            //     $mail->bcc($reminder->bcc_email);
                            // }
                            // if ($reminder->driver_reminder === 'license' && !empty($reminder->driver->license_expire_date) && !empty($reminder->driver->license_no)) {
                            //     Mail::to("ankit.610weblab@gmail.com")->send($mail);
                            //     $reminder->status = "Completed";
                            // } elseif ($reminder->driver_reminder !== 'license') {
                            //     $reminder->status = "Completed";
                            //     Mail::to("ankit.610weblab@gmail.com")->send($mail);
                            // }
                            // $reminder->save();

                            $sendEmail = false;

                            if ($reminder->driver_reminder === 'license') {
                                if (!empty($reminder->driver->license_expire_date) && !empty($reminder->driver->license_no)) {
                                    Mail::to("ankit.610weblab@gmail.com")->send($mail);
                                    $sendEmail = true;
                                }
                            }  elseif ($reminder->driver_reminder !== 'license') {
                                Mail::to("ankit.610weblab@gmail.com")->send($mail);
                                $sendEmail = true;
                            }
                    
                            // Update status only if email is sent
                            if ($sendEmail) {
                                $reminder->status = "Completed";
                                $reminder->save();
                            }
                        }
                    }
                } else if ($reminder->document_type === "Safety") {
                    $originalDate = new \DateTime($reminder->expire_date);
                    $formattedDate = $originalDate->format('Y-m-d');
                    $daysBefore = (clone $originalDate)->modify('-' . $reminder->days_before . ' ' . $reminder->notify_day)->format('Y-m-d');
                    if ($currentDate <= $originalDate || $currentDate === $formattedDate) {
                        if ($reminder->email_status === 1) {
                            $mailData = [
                                'title' => 'Mail From Shiva Transport',
                                // 'name' => $reminder->toArray(),
                                'type' => $reminder->document_type,
                                'truck' => $reminder->vehicle->truck,
                                'expire_date' => $reminder->expire_date,
                                // 'policy_no' => $reminder->insurance->policy_no,
                                "tires" => $reminder->tires,
                                "brakes" => $reminder->brakes,
                                "lights" => $reminder->lights,
                                "windshield" => $reminder->windshield,
                                "wipers" => $reminder->wipers,
                                "mirrors" => $reminder->mirrors,
                                "seatbelts" => $reminder->seatbelts,
                                "steering" => $reminder->steering,
                                "suspension" => $reminder->suspension,
                                // 'vehicle' => implode(", ", [$reminder->insurance->vehicle->make, $reminder->insurance->vehicle->model, $reminder->insurance->vehicle->year]),
                                'logo_image' => base64_encode(file_get_contents(public_path('/assets/img/logo_new.png'))),
                                'message' => $reminder->comments,
                               
                                'vehicle_vin_no' => $reminder->vehicle_vin_no,
                                'reminder_type' => $reminder->driver_reminder ?? ""
                            ];
                            $mail = new ReminderMail($mailData);
                            if (!empty($reminder->cc_email)) {
                                $mail->cc("sahil610weblab@gmail.com");
                            }
                            // if (!empty($reminder->bcc_email)) {
                            //     $mail->bcc($reminder->bcc_email);
                            // }
                            Mail::to("ankit.610weblab@gmail.com")->send($mail);
                            $reminder->status = "Completed";
                            $reminder->save();
                        }
                    }
                } else {
                    $originalDate = new \DateTime($reminder->expire_date);
                    $formattedDate = $originalDate->format('Y-m-d');
                    $daysBefore = (clone $originalDate)->modify('-' . $reminder->days_before . ' ' . $reminder->notify_day)->format('Y-m-d');
                    if ($currentDate <= $daysBefore  || $currentDate === $formattedDate) {
                        if ($reminder->email_status === 1) {
                            $mailData = [
                                'title' => 'Mail From Shiva Transport',
                                'type' => $reminder->document_type,
                                'name' => '',
                                'expire_date' => $reminder->expire_date,
                                'message' => $reminder->comments,
                                'reminder_type' => $reminder->driver_reminder ?? ""
                            ];
                            $mail = new ReminderMail($mailData);
                            if (!empty($reminder->cc_email)) {
                                 $mail->cc("sahil610weblab@gmail.com");
                            }
                            // if (!empty($reminder->bcc_email)) {
                            //     $mail->bcc($reminder->bcc_email);
                            // }
                            Mail::to("ankit.610weblab@gmail.com")->send($mail);
                            $reminder->status = "Completed";
                            $reminder->save();
                        }
                    }
                }
            }
        }
    }
}
