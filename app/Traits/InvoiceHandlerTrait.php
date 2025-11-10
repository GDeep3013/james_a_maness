<?php

namespace App\Traits;

trait InvoiceHandlerTrait
{
    use RouteInvoiceTrait, ParkingInvoiceTrait, UpsInvoiceTrait, AddOnOrderInvoiceTrait, CustomInvoiceTrait;

    public function handleMetaData($invoice, $metaData, $type)
    {
        switch ($type) {
            case 'routes':
                $status = $this->handleRouteMeta($invoice, $metaData);
                break;

            case 'parking':
                $status = $this->handleParkingMeta($invoice, $metaData);
                break;

            case 'ups':
                $status = $this->handleUpsInvoiceMeta($invoice, $metaData);
                break;

            case 'order':
                $status = $this->handleAddOnOrderMeta($invoice, $metaData);
                break;
            case 'custom':
                $status = $this->handleCustomInvoiceMeta($invoice, $metaData);
                break;
                // Add additional cases for other types
            default:
                throw new \Exception("Unsupported invoice type: $type");
        }
        return $status;
    }
}
