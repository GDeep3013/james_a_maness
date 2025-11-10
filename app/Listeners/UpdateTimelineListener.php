<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\TimeLineUpdated;
use App\Models\Timeline;

class UpdateTimelineListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(TimeLineUpdated $event)
    {
        Timeline::updateOrCreate(
            [
                'trip_id' => $event->tripId,
                'type' => $event->type,
            ],
            [
                'user_id' => $event->userId,
                'desc' => $event->desc,
                'date' => $event->date,
                'time' => $event->time,
            ]
        );
    }
}
