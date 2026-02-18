package com.nsbm.group03.employeeManagementService.dto;

public class EmployeeStatisticsDTO {
    
    private Long totalEmployees;
    private Long activeEmployees;
    private Long inactiveEmployees;
    private Long onLeaveEmployees;
    private Double averageSalary;
    private Double totalSalaryExpense;
    private Long employeesByDepartmentCount;
    
    // Constructors
    public EmployeeStatisticsDTO() {
    }
    
    public EmployeeStatisticsDTO(Long totalEmployees, Long activeEmployees, 
                                 Long inactiveEmployees, Long onLeaveEmployees,
                                 Double averageSalary, Double totalSalaryExpense) {
        this.totalEmployees = totalEmployees;
        this.activeEmployees = activeEmployees;
        this.inactiveEmployees = inactiveEmployees;
        this.onLeaveEmployees = onLeaveEmployees;
        this.averageSalary = averageSalary;
        this.totalSalaryExpense = totalSalaryExpense;
    }
    
    // Getters and Setters
    public Long getTotalEmployees() {
        return totalEmployees;
    }
    
    public void setTotalEmployees(Long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }
    
    public Long getActiveEmployees() {
        return activeEmployees;
    }
    
    public void setActiveEmployees(Long activeEmployees) {
        this.activeEmployees = activeEmployees;
    }
    
    public Long getInactiveEmployees() {
        return inactiveEmployees;
    }
    
    public void setInactiveEmployees(Long inactiveEmployees) {
        this.inactiveEmployees = inactiveEmployees;
    }
    
    public Long getOnLeaveEmployees() {
        return onLeaveEmployees;
    }
    
    public void setOnLeaveEmployees(Long onLeaveEmployees) {
        this.onLeaveEmployees = onLeaveEmployees;
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
    
    public Long getEmployeesByDepartmentCount() {
        return employeesByDepartmentCount;
    }
    
    public void setEmployeesByDepartmentCount(Long employeesByDepartmentCount) {
        this.employeesByDepartmentCount = employeesByDepartmentCount;
    }
}
