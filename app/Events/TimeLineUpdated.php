<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TimeLineUpdated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $tripId;
    public $userId;
    public $type;
    public $desc;
    public $date;
    public $time;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct( $tripId, $userId, $type, $desc, $date, $time)
    {
        $this->tripId = $tripId;
        $this->userId = $userId;
        $this->type = $type;
        $this->desc = $desc;
        $this->date = $date;
        $this->time = $time;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
