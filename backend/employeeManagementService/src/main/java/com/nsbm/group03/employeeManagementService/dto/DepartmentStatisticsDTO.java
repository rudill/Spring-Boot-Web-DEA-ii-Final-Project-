package com.nsbm.group03.employeeManagementService.dto;

public class DepartmentStatisticsDTO {
    
    private String department;
    private Long employeeCount;
    private Double averageSalary;
    private Double totalSalaryExpense;
    private Long activeCount;
    
    // Constructors
    public DepartmentStatisticsDTO() {
    }
    
    public DepartmentStatisticsDTO(String department, Long employeeCount, 
                                   Double averageSalary, Double totalSalaryExpense, 
                                   Long activeCount) {
        this.department = department;
        this.employeeCount = employeeCount;
        this.averageSalary = averageSalary;
        this.totalSalaryExpense = totalSalaryExpense;
        this.activeCount = activeCount;
    }
    
    // Getters and Setters
    public String getDepartment() {
        return department;
    }
    
    public void setDepartment(String department) {
        this.department = department;
    }
    
    public Long getEmployeeCount() {
        return employeeCount;
    }
    
    public void setEmployeeCount(Long employeeCount) {
        this.employeeCount = employeeCount;
    }
    
    public Double getAverageSalary() {
        return averageSalary;
    }
    
    public void setAverageSalary(Double averageSalary) {
        this.averageSalary = averageSalary;
    }
    
    public Double getTotalSalaryExpense() {
        return totalSalaryExpense;
    }
    
    public void setTotalSalaryExpense(Double totalSalaryExpense) {
        this.totalSalaryExpense = totalSalaryExpense;
    }
    
    public Long getActiveCount() {
        return activeCount;
    }
    
    public void setActiveCount(Long activeCount) {
        this.activeCount = activeCount;
    }
}
