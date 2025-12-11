using System.ServiceModel;
using BillingService.Models;

namespace BillingService.Services;

[ServiceContract]
public interface IBillingService
{
    [OperationContract]
    Task<BillResponse> CreateBillAsync(CreateBillRequest request);

    [OperationContract]
    Task<GetBillsResponse> GetBillsByStudentAsync(GetBillsRequest request);

    [OperationContract]
    Task<PayBillResponse> PayBillAsync(PayBillRequest request);

    [OperationContract]
    Task<GetBillsResponse> GetUnpaidBillsAsync(GetUnpaidBillsRequest request);

    [OperationContract]
    Task<GetTotalDebtResponse> GetTotalDebtAsync(GetTotalDebtRequest request);
}

// Request/Response DTOs
public class CreateBillRequest
{
    public string Token { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
}

public class BillResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public BillDto? Bill { get; set; }
}

public class BillDto
{
    public int Id { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public bool IsPaid { get; set; }
    public DateTime? PaymentDate { get; set; }
}

public class GetBillsRequest
{
    public string Token { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
}

public class GetBillsResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public List<BillDto> Bills { get; set; } = new();
}

public class PayBillRequest
{
    public string Token { get; set; } = string.Empty;
    public int BillId { get; set; }
}

public class PayBillResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public BillDto? Bill { get; set; }
}

public class GetUnpaidBillsRequest
{
    public string Token { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
}

public class GetTotalDebtRequest
{
    public string Token { get; set; } = string.Empty;
    public string StudentId { get; set; } = string.Empty;
}

public class GetTotalDebtResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public decimal TotalDebt { get; set; }
    public int UnpaidBillsCount { get; set; }
}
