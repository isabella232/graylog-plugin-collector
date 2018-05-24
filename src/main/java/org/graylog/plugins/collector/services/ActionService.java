package org.graylog.plugins.collector.services;

import com.mongodb.BasicDBObject;
import org.bson.types.ObjectId;
import org.graylog.plugins.collector.rest.models.CollectorAction;
import org.graylog.plugins.collector.rest.models.CollectorActions;
import org.graylog2.bindings.providers.MongoJackObjectMapperProvider;
import org.graylog2.database.MongoConnection;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.mongojack.DBQuery;
import org.mongojack.JacksonDBCollection;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

public class ActionService {
    private static final String COLLECTION_NAME = "collector_actions";
    private final JacksonDBCollection<CollectorActions, ObjectId> dbCollection;

    @Inject
    public ActionService(MongoConnection mongoConnection,
                         MongoJackObjectMapperProvider mapper){
        dbCollection = JacksonDBCollection.wrap(
                mongoConnection.getDatabase().getCollection(COLLECTION_NAME),
                CollectorActions.class,
                ObjectId.class,
                mapper.get());
    }

    public CollectorActions fromRequest(String collectorId, List<CollectorAction> actions) {
        CollectorActions collectorActions = findActionBySidecar(collectorId, false);
        if (collectorActions == null) {
            return CollectorActions.create(
                    collectorId,
                    DateTime.now(DateTimeZone.UTC),
                    actions);
        }
        List<CollectorAction> updatedActions = new ArrayList<>();
        for (final CollectorAction action : actions) {
            for (final CollectorAction existingsAction : collectorActions.action()) {
                if (!existingsAction.collector().equals(action.collector())) {
                    updatedActions.add(existingsAction);
                }
            }
            updatedActions.add(action);
        }
        return CollectorActions.create(
                collectorActions.id(),
                collectorId,
                DateTime.now(DateTimeZone.UTC),
                updatedActions);
    }

    public CollectorActions saveAction(CollectorActions collectorActions) {
        return dbCollection.findAndModify(
                DBQuery.is("sidecar_id", collectorActions.sidecarId()),
                new BasicDBObject(),
                new BasicDBObject(),
                false,
                collectorActions,
                true,
                true);
    }

    public CollectorActions findActionBySidecar(String sidecarId, boolean remove) {
        if (remove) {
            return dbCollection.findAndRemove(DBQuery.is("sidecar_id", sidecarId));
        } else {
            return dbCollection.findOne(DBQuery.is("sidecar_id", sidecarId));
        }
    }
}
