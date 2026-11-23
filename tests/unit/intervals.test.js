import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DAY_START_MINUTES, DAY_END_MINUTES, activityInterval, findOverlap } from '../../intervals.js';
import { formatTimestamp } from '../../dates.js';
import { Timeline } from '../../timeline.js';

const ep = (id, start, end) => ({ id, activity: id, startMinutes: start, endMinutes: end });

// An activity as LO-TUD keeps it: stamps only, no minutes.
const stamped = (id, startTime, endTime) => ({ id, activity: id, category: 'Activities', startTime, endTime });

// Runs fn with window.timelineManager.activities.primary set to `list`, in `timeZone`.
function withPrimary(list, timeZone, fn) {
    const saved = { window: globalThis.window, tz: process.env.TZ };
    process.env.TZ = timeZone;
    try {
        globalThis.window = { timelineManager: { activities: { primary: list } } };
        return fn(new Timeline('primary'));
    } finally {
        if (saved.window === undefined) delete globalThis.window; else globalThis.window = saved.window;
        if (saved.tz === undefined) delete process.env.TZ; else process.env.TZ = saved.tz;
    }
}

test('the diary day runs from 04:00 to 04:00 the next morning', () => {
    assert.equal(DAY_START_MINUTES, 4 * 60);
    assert.equal(DAY_END_MINUTES, 28 * 60);
});

test('activityInterval prefers the stored minutes', () => {
    assert.deepEqual(activityInterval({ startMinutes: 1670, endMinutes: 1680, startTime: 'x', endTime: 'y' }),
        { start: 1670, end: 1680 });
});

test('activityInterval reads activities without minutes from their times of day', () => {
    const legacy = (s, e) => activityInterval({ startTime: s, endTime: e });
    assert.deepEqual(legacy('2026-11-21 03:50', '2026-11-21 04:00'), { start: 1670, end: 1680 });
    assert.deepEqual(legacy('2026-11-20 23:50', '2026-11-21 00:00'), { start: 1430, end: 1440 });
    assert.deepEqual(legacy('2026-11-20 04:00', '2026-11-20 04:10'), { start: 240, end: 250 });
    assert.deepEqual(legacy('2026-11-21 01:00', '2026-11-21 04:00'), { start: 1500, end: 1680 });
    // A month-early stamp from the v1.0.0 roll-over defect still gives the right minutes.
    assert.deepEqual(legacy('2026-11-30 23:50', '2026-11-01 00:00'), { start: 1430, end: 1440 });
    assert.equal(activityInterval({}), null);
    assert.equal(activityInterval(null), null);
    assert.equal(activityInterval({ startTime: 'later', endTime: '04:00' }), null);
});

test('findOverlap sees the episode that ends at 04:00 the next morning', () => {
    const closing = [ep('a', 1670, 1680)];
    assert.equal(findOverlap(closing, 1670, 1680)?.id, 'a');
    const longClosing = [ep('b', 1500, 1680)];
    assert.equal(findOverlap(longClosing, 1560, 1570)?.id, 'b');
    assert.equal(findOverlap(longClosing, 1490, 1500), null); // touches, does not overlap
    const legacyClosing = [{ id: 'c', activity: 'c', startTime: '2026-11-21 03:00', endTime: '2026-11-21 04:00' }];
    assert.equal(findOverlap(legacyClosing, 1650, 1660)?.id, 'c');
});

test('findOverlap allows adjacent blocks and skips the block being resized', () => {
    const day = [ep('m', 480, 490), ep('n', 490, 500)];
    assert.equal(findOverlap(day, 500, 510), null);
    assert.equal(findOverlap(day, 470, 480), null);
    assert.equal(findOverlap(day, 485, 495)?.id, 'm');
    assert.equal(findOverlap(day, 480, 495, 'm')?.id, 'n');
    assert.equal(findOverlap(day, 480, 490, 'm'), null);
    assert.equal(findOverlap(day, 480, 490, undefined)?.id, 'm'); // no id given: nothing skipped
    assert.equal(findOverlap(undefined, 480, 490), null);
});

test('Timeline.validate compares episodes by their minutes, not by parsed stamps', () => {
    // 8 March 2026 in New York, when 02:00 to 03:00 is skipped. Parsed with
    // new Date(), 02:00 and 02:30 became 03:00 and 03:30, so these three
    // adjacent episodes were reported as overlapping.
    const day = [
        stamped('A', '2026-03-08 02:00', '2026-03-08 02:30'),
        stamped('B', '2026-03-08 02:30', '2026-03-08 03:00'),
        stamped('C', '2026-03-08 03:00', '2026-03-08 03:10')
    ];
    withPrimary(day, 'America/New_York', (timeline) => {
        assert.equal(timeline.validate(), true);
        // A real overlap is still caught.
        day.push(stamped('D', '2026-03-08 03:00', '2026-03-08 04:00'));
        assert.throws(() => timeline.validate(), /Overlap detected between activities "C" and "D"/);
    });
});

test('Timeline.validate accepts a whole day of 10-minute blocks across a month end', () => {
    // Stamps as LO-TUD now builds them for a diary of 30 November 2026: 144 blocks
    // from 04:00 to 04:00, those after midnight on 1 December.
    const day = [];
    for (let m = DAY_START_MINUTES; m < DAY_END_MINUTES; m += 10) {
        day.push(stamped(`slot${m}`, formatTimestamp('2026-11-30', m), formatTimestamp('2026-11-30', m + 10)));
    }
    assert.equal(day.length, 144);
    assert.deepEqual([day[0].startTime, day[143].endTime], ['2026-11-30 04:00', '2026-12-01 04:00']);
    withPrimary(day, 'Europe/London', (timeline) => {
        assert.equal(timeline.validate(), true);
        // A second block on the last slot, 03:50 to 04:00, overlaps the first.
        day.push(stamped('again', '2026-12-01 03:50', '2026-12-01 04:00'));
        assert.throws(() => timeline.validate(), /Overlap detected between activities "slot1670" and "again"/);
    });
});
