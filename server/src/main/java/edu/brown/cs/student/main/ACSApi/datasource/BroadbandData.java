package edu.brown.cs.student.main.ACSApi.datasource;

import java.time.LocalDateTime;

/**
 * Broadband Data class
 *
 * @param percentage
 * @param state
 * @param county
 * @param dateTime
 */
public record BroadbandData(
    double percentage, String state, String county, LocalDateTime dateTime) {}
