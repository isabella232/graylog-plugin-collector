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
package org.graylog.plugins.collector.periodical;

import com.google.common.base.Supplier;
import org.graylog.plugins.collector.collectors.CollectorService;
import org.graylog.plugins.collector.system.CollectorSystemConfiguration;
import org.graylog2.plugin.periodical.Periodical;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;

public class PurgeExpiredCollectorsThread extends Periodical {
    private static final Logger LOG = LoggerFactory.getLogger(PurgeExpiredCollectorsThread.class);

    private final CollectorService collectorService;
    private final Supplier<CollectorSystemConfiguration> configSupplier;

    @Inject
    public PurgeExpiredCollectorsThread(CollectorService collectorService,
                                        Supplier<CollectorSystemConfiguration> configSupplier) {
        this.collectorService = collectorService;
        this.configSupplier = configSupplier;
    }

    @Override
    public boolean runsForever() {
        return false;
    }

    @Override
    public boolean stopOnGracefulShutdown() {
        return true;
    }

    @Override
    public boolean masterOnly() {
        return true;
    }

    @Override
    public boolean startOnThisNode() {
        return true;
    }

    @Override
    public boolean isDaemon() {
        return true;
    }

    @Override
    public int getInitialDelaySeconds() {
        return 0;
    }

    @Override
    public int getPeriodSeconds() {
        return 60 * 60;
    }

    @Override
    protected Logger getLogger() {
        return LOG;
    }

    @Override
    public void doRun() {
        final int purgedCollectors = collectorService.destroyExpired(configSupplier.get().collectorExpirationThreshold());
        LOG.debug("Purged {} inactive collectors.", purgedCollectors);
    }
}
