using Microsoft.EntityFrameworkCore;
using BillingService.Data;
using BillingService.Models;

namespace BillingService.Services;

public class BillingServiceImpl : IBillingService
{
    private readonly BillingDbContext _context;
    private readonly IAuthService _authService;

    public BillingServiceImpl(BillingDbContext context, IAuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    public async Task<BillResponse> CreateBillAsync(CreateBillRequest request)
    {
        var user = await _authService.ValidateTokenAsync(request.Token);
        
        if (user == null)
        {
            return new BillResponse 
            { 
                Success = false, 
                Message = "Unauthorized: Invalid token" 
            };
        }

        if (user.Role != "ADMIN")
        {
            return new BillResponse 
            { 
                Success = false, 
                Message = "Forbidden: Admin role required" 
            };
        }

        var bill = new Bill
        {
            StudentId = request.StudentId,
            Amount = request.Amount,
            Description = request.Description,
            DueDate = request.DueDate,
            IsPaid = false
        };

        _context.Bills.Add(bill);
        await _context.SaveChangesAsync();

        return new BillResponse
        {
            Success = true,
            Message = "Bill created successfully",
            Bill = MapToDto(bill)
        };
    }

    public async Task<GetBillsResponse> GetBillsByStudentAsync(GetBillsRequest request)
    {
        var user = await _authService.ValidateTokenAsync(request.Token);
        
        if (user == null)
        {
            return new GetBillsResponse 
            { 
                Success = false, 
                Message = "Unauthorized: Invalid token" 
            };
        }

        var bills = await _context.Bills
            .Where(b => b.StudentId == request.StudentId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        return new GetBillsResponse
        {
            Success = true,
            Message = "Bills retrieved successfully",
            Bills = bills.Select(MapToDto).ToList()
        };
    }

    public async Task<PayBillResponse> PayBillAsync(PayBillRequest request)
    {
        var user = await _authService.ValidateTokenAsync(request.Token);
        
        if (user == null)
        {
            return new PayBillResponse 
            { 
                Success = false, 
                Message = "Unauthorized: Invalid token" 
            };
        }

        var bill = await _context.Bills.FindAsync(request.BillId);

        if (bill == null)
        {
            return new PayBillResponse 
            { 
                Success = false, 
                Message = "Bill not found" 
            };
        }

        if (bill.IsPaid)
        {
            return new PayBillResponse 
            { 
                Success = false, 
                Message = "Bill already paid" 
            };
        }

        bill.IsPaid = true;
        bill.PaymentDate = DateTime.UtcNow;
        bill.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new PayBillResponse
        {
            Success = true,
            Message = "Bill paid successfully",
            Bill = MapToDto(bill)
        };
    }

    public async Task<GetBillsResponse> GetUnpaidBillsAsync(GetUnpaidBillsRequest request)
    {
        var user = await _authService.ValidateTokenAsync(request.Token);
        
        if (user == null)
        {
            return new GetBillsResponse 
            { 
                Success = false, 
                Message = "Unauthorized: Invalid token" 
            };
        }

        var bills = await _context.Bills
            .Where(b => b.StudentId == request.StudentId && !b.IsPaid)
            .OrderBy(b => b.DueDate)
            .ToListAsync();

        return new GetBillsResponse
        {
            Success = true,
            Message = "Unpaid bills retrieved successfully",
            Bills = bills.Select(MapToDto).ToList()
        };
    }

    public async Task<GetTotalDebtResponse> GetTotalDebtAsync(GetTotalDebtRequest request)
    {
        var user = await _authService.ValidateTokenAsync(request.Token);
        
        if (user == null)
        {
            return new GetTotalDebtResponse 
            { 
                Success = false, 
                Message = "Unauthorized: Invalid token" 
            };
        }

        var unpaidBills = await _context.Bills
            .Where(b => b.StudentId == request.StudentId && !b.IsPaid)
            .ToListAsync();

        var totalDebt = unpaidBills.Sum(b => b.Amount);

        return new GetTotalDebtResponse
        {
            Success = true,
            Message = "Total debt calculated successfully",
            TotalDebt = totalDebt,
            UnpaidBillsCount = unpaidBills.Count
        };
    }

    private static BillDto MapToDto(Bill bill)
    {
        return new BillDto
        {
            Id = bill.Id,
            StudentId = bill.StudentId,
            Amount = bill.Amount,
            Description = bill.Description,
            DueDate = bill.DueDate,
            IsPaid = bill.IsPaid,
            PaymentDate = bill.PaymentDate
        };
    }
}
