package com.example.secrud.designpatterns.strategy;

public interface ProcessingStrategy<T> {
    T process(T entity);
    String getStrategyType();
}
