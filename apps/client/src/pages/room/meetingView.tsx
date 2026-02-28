import { useMemo } from "react";
import {
  useTracks,
  VideoTrack,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track, Participant } from "livekit-client";
import { Mic, MicOff, VideoOff, User } from "lucide-react";

function getGridLayout(count: number) {
  if (count <= 1) return { cols: 1, rows: 1 };
  if (count === 2) return { cols: 2, rows: 1 };
  if (count <= 4) return { cols: 2, rows: 2 };
  if (count <= 6) return { cols: 3, rows: 2 };
  if (count <= 9) return { cols: 3, rows: 3 };
  if (count <= 12) return { cols: 4, rows: 3 };
  if (count <= 16) return { cols: 4, rows: 4 };
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  return { cols, rows };
}

const MeetingView = () => {
  const sources = useMemo(
    () => [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    []
  );

  const tracks = useTracks(sources, { onlySubscribed: false });
  const { localParticipant } = useLocalParticipant();

  const participantTracks = useMemo(() => {
    const seen = new Set<string>();
    return tracks.filter((t) => {
      if (seen.has(t.participant.identity)) return false;
      seen.add(t.participant.identity);
      return true;
    });
  }, [tracks]);

  const { cols } = getGridLayout(participantTracks.length);

  if (participantTracks.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-white/20" />
          </div>
          <p className="text-white/40 text-sm">Waiting for participants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-3 pb-20">
      <div
        className="w-full h-full grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridAutoRows: "1fr",
        }}
      >
        {participantTracks.map((trackRef) => {
          const isLocal =
            trackRef.participant.identity === localParticipant.identity;
          const hasVideo =
            trackRef.publication &&
            !trackRef.publication.isMuted &&
            trackRef.publication.track;
          const isSpeaking = trackRef.participant.isSpeaking;
          const isMicEnabled = isParticipantMicEnabled(trackRef.participant);

          return (
            <div
              key={trackRef.participant.identity}
              className={`
                relative rounded-xl overflow-hidden bg-[#1a1a2e] transition-all duration-300
                ${isSpeaking ? "ring-2 ring-[#6658fe] shadow-[0_0_20px_rgba(102,88,254,0.15)]" : "ring-1 ring-white/[0.06]"}
              `}
            >
              {hasVideo ? (
                <VideoTrack
                  trackRef={trackRef}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#12121f]">
                  <div
                    className={`
                      w-20 h-20 rounded-full flex items-center justify-center text-2xl font-semibold
                      ${isSpeaking ? "bg-[#6658fe]/20 text-[#a49bff] ring-2 ring-[#6658fe]/40" : "bg-white/[0.06] text-white/40"}
                      transition-all duration-300
                    `}
                  >
                    {trackRef.participant.identity
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                </div>
              )}

              {/* Bottom info bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-8 pb-2.5 px-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-white/90 text-[13px] font-medium truncate">
                      {trackRef.participant.identity}
                      {isLocal && (
                        <span className="text-[#a49bff] ml-1.5 text-[11px] font-normal">
                          (You)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!isMicEnabled && (
                      <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                        <MicOff size={12} className="text-red-400" />
                      </div>
                    )}
                    {!hasVideo && (
                      <div className="w-6 h-6 rounded-full bg-white/[0.08] flex items-center justify-center">
                        <VideoOff size={12} className="text-white/40" />
                      </div>
                    )}
                    {isSpeaking && isMicEnabled && (
                      <div className="flex items-center gap-[2px] h-6 px-1.5">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-[3px] rounded-full bg-[#6658fe] animate-pulse"
                            style={{
                              height: `${8 + Math.random() * 8}px`,
                              animationDelay: `${i * 150}ms`,
                              animationDuration: "0.6s",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Speaking pulse ring */}
              {isSpeaking && (
                <div className="absolute inset-0 rounded-xl ring-2 ring-[#6658fe]/50 animate-pulse pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

function isParticipantMicEnabled(participant: Participant): boolean {
  const micPub = participant.getTrackPublication(Track.Source.Microphone);
  return !!micPub && !micPub.isMuted;
}

export default MeetingView;
