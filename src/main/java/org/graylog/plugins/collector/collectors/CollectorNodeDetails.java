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
package org.graylog.plugins.collector.collectors;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.auto.value.AutoValue;
import org.graylog.plugins.collector.collectors.rest.models.CollectorLogFile;
import org.graylog.plugins.collector.collectors.rest.models.CollectorMetrics;
import org.graylog.plugins.collector.collectors.rest.models.CollectorNodeDetailsSummary;
import org.graylog.plugins.collector.collectors.rest.models.CollectorStatusList;

import javax.annotation.Nullable;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@AutoValue
@JsonAutoDetect
public abstract class CollectorNodeDetails {
    @JsonProperty("operating_system")
    @NotNull
    @Size(min = 1)
    public abstract String operatingSystem();

    @JsonProperty("tags")
    @Nullable
    public abstract List<String> tags();

    @JsonProperty("ip")
    @Nullable
    public abstract String ip();

    @JsonProperty("metrics")
    @Nullable
    public abstract CollectorMetrics metrics();

    @JsonProperty("log_file_list")
    @Nullable
    public abstract List<CollectorLogFile> logFileList();

    @JsonProperty("status")
    @Nullable
    public abstract CollectorStatusList statusList();

    @JsonCreator
    public static CollectorNodeDetails create(@JsonProperty("operating_system") String operatingSystem,
                                              @JsonProperty("tags") @Nullable List<String> tags,
                                              @JsonProperty("ip") @Nullable String ip,
                                              @JsonProperty("metrics") @Nullable CollectorMetrics metrics,
                                              @JsonProperty("log_file_list") @Nullable List<CollectorLogFile> logFileList,
                                              @JsonProperty("status") @Nullable CollectorStatusList statusList) {
        return new AutoValue_CollectorNodeDetails(operatingSystem, tags, ip, metrics, logFileList, statusList);
    }

    public CollectorNodeDetailsSummary toSummary() {
        return CollectorNodeDetailsSummary.create(operatingSystem(), tags(), ip(), metrics(), logFileList(), statusList());
    }
}
