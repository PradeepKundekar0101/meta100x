import { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";
import { RemoteTrackPublication, RemoteParticipant } from "livekit-client";

const MeetingSubscriptionManager = () => {
  const room = useRoomContext();

  useEffect(() => {
    room.remoteParticipants.forEach((participant) => {
      participant.trackPublications.forEach((pub) => {
        if (!pub.isSubscribed) {
          pub.setSubscribed(true);
        }
      });
    });
  }, [room]);

  useEffect(() => {
    const handleTrackPublished = (
      pub: RemoteTrackPublication,
      _participant: RemoteParticipant
    ) => {
      pub.setSubscribed(true);
    };

    const handleParticipantConnected = (participant: RemoteParticipant) => {
      participant.trackPublications.forEach((pub) => {
        if (!pub.isSubscribed) {
          pub.setSubscribed(true);
        }
      });
    };

    room.on("trackPublished", handleTrackPublished);
    room.on("participantConnected", handleParticipantConnected);

    return () => {
      room.off("trackPublished", handleTrackPublished);
      room.off("participantConnected", handleParticipantConnected);
    };
  }, [room]);

  return null;
};

export default MeetingSubscriptionManager;
