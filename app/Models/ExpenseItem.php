<?php 
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseItem extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'expense_items';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'expense_id',
        'exp_type_id',
        'tax_type_id',
        'particular',
        'gross_amount',
        'tax_amount',
        'total_amount',
    ];

    /**
     * Define the relationship with the Expense model.
     */
    public function expense()
    {
        return $this->belongsTo(Expense::class);
    }

    /**
     * Define the relationship with the ExpenseType model.
     */
    public function expenseType()
    {
        return $this->belongsTo(ExpenseType::class, 'exp_type_id');
    }

    /**
     * Define the relationship with the TaxType model.
     */
    public function taxType()
    {
        return $this->belongsTo(TaxType::class, 'tax_type_id');
    }
}