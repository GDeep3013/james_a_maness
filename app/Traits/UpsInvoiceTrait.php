<?php

namespace App\Traits;

use App\Models\PaymentMeta;

trait UpsInvoiceTrait
{
    public function handleUpsInvoiceMeta($invoice, $metaData)
    {
        try {
            $operationSuccessful = true;
            foreach ($metaData as $metaItem) {
                $decodedMetaValue = json_decode($metaItem['meta_value'], true);
                $meta = PaymentMeta::updateOrCreate(
                    [
                        'payment_id' => $invoice->id,
                        'meta_key' => $metaItem['meta_key'],
                    ],
                    [
                        'meta_value' => json_encode($decodedMetaValue, JSON_PRETTY_PRINT),  // Store the decoded value as a JSON string
                    ]
                );
                if (!$meta) {
                    $operationSuccessful = false; 
                    break;
                }
            }

            if ($operationSuccessful) {
                return ['status' => true];
            } else {
                return ['status' => false];
            }
        } catch (\Exception $e) {
            // Return false if there was an error
            return false;
        }
    }
}
