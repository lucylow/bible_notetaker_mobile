import { describe, expect, it } from "vitest";
import { collectMonths, collectSermonSeries, collectSermonTags, filterByArchive, filterByMonth, filterNotes, filterSermons, sortSermons } from "../lib/sermon-filters";
import type { Sermon } from "../lib/bible-note-store";
import { createAudioSession } from "../lib/audio-session";

const sermons: Sermon[] = [{ id: "1", title: "Faith in Action", speaker: "James", date: "2026-08-16", notes: [{ id: "n1", content: "Insight", timestamp: 1, isActionItem: false }, { id: "n2", content: "Do this", timestamp: 2, isActionItem: true }], actionItems: [], tags: ["Faith", "Action"], series: "Walking with God", archived: false, audio: createAudioSession() }, { id: "2", title: "Hope in Waiting", speaker: "Mary", date: "2026-08-09", notes: [], actionItems: [], tags: ["Hope"], series: "Waiting Well", archived: false, audio: createAudioSession() }];

describe("sermon filters", () => {
  it("filters sermons by query, tag, and series", () => {
    expect(filterSermons(sermons, "faith", null, null)).toHaveLength(1);
    expect(filterSermons(sermons, "", "Hope", null)[0].id).toBe("2");
    expect(filterSermons(sermons, "", null, "Waiting Well")[0].id).toBe("2");
    expect(sortSermons(sermons, "recent")[0].id).toBe("1");
    expect(sortSermons(sermons, "oldest")[0].id).toBe("2");
    expect(filterByArchive([{ ...sermons[0], archived: true }, sermons[1]], "archived")).toHaveLength(1);
    expect(filterByMonth(sermons, "2026-08")).toHaveLength(2);
    expect(collectMonths(sermons)).toEqual(["2026-08"]);
  });
  it("filters notes by type and collects unique organization values", () => {
    expect(filterNotes(sermons[0].notes, "actions")).toHaveLength(1);
    expect(filterNotes(sermons[0].notes, "insights")).toHaveLength(1);
    expect(collectSermonTags(sermons)).toEqual(["Action", "Faith", "Hope"]);
    expect(collectSermonSeries(sermons)).toEqual(["Waiting Well", "Walking with God"]);
  });
});
