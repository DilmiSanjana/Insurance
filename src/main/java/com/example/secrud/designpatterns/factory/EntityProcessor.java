package com.example.secrud.designpatterns.factory;

import com.example.secrud.designpatterns.strategy.ProcessingStrategy;

public interface EntityProcessor<T> {
    T processEntity(T entity, String processingType);
    void setStrategy(ProcessingStrategy<T> strategy);
}
