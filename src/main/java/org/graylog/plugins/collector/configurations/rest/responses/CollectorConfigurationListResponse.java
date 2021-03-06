/*
 * Copyright (C) 2020 Graylog, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the Server Side Public License, version 1,
 * as published by MongoDB, Inc.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Server Side Public License for more details.
 *
 * You should have received a copy of the Server Side Public License
 * along with this program. If not, see
 * <http://www.mongodb.com/licensing/server-side-public-license>.
 */
package org.graylog.plugins.collector.configurations.rest.responses;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;
import org.graylog.plugins.collector.configurations.rest.models.CollectorConfigurationSummary;

import java.util.Collection;

@AutoValue
public abstract class CollectorConfigurationListResponse {
    @JsonProperty
    public abstract long total();

    @JsonProperty
    public abstract Collection<CollectorConfigurationSummary> configurations();

    @JsonCreator
    public static CollectorConfigurationListResponse create(@JsonProperty("total") long total,
                                                            @JsonProperty("configurations") Collection<CollectorConfigurationSummary> configurations) {
        return new AutoValue_CollectorConfigurationListResponse(total, configurations);
    }
}
