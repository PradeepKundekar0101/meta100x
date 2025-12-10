import { useEffect, useRef } from "react";
import { useRoomContext } from "@livekit/components-react";
import { RemoteParticipant, RemoteTrackPublication } from "livekit-client";

const ProximitySubscriptionManager = () => {
  const room = useRoomContext();
  const nearbyIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleProximityUpdates = (e: CustomEvent) => {
      const nearByIds = e.detail.nearbyUserIds as string[];
      nearbyIdsRef.current = new Set(nearByIds);

      room.remoteParticipants.forEach((participant) => {
        const shouldSubscribe = nearbyIdsRef.current.has(participant.identity);
        updateSubscriptionForParticipant(participant, shouldSubscribe);
      });
    };
    window.addEventListener(
      "ph-proximity-update",
      handleProximityUpdates as EventListener
    );
  }, [room]);
  const updateSubscriptionForParticipant = (
    participant: RemoteParticipant,
    shouldSubscribe: boolean
  ) => {
    participant.trackPublications.forEach((pub) => {
      if (pub.isSubscribed !== shouldSubscribe) {
        pub.setSubscribed(shouldSubscribe);
      }
    });
  };
  useEffect(() => {
    const handleTrackPublished = (
      pub: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      const isClose = nearbyIdsRef.current.has(participant.identity);
      pub.setSubscribed(isClose);
    };
    room.on("trackPublished", handleTrackPublished);
    return () => {
      room.off("trackPublished", handleTrackPublished);
    };
  }, [room]);
  return null;
};
export default ProximitySubscriptionManager;
