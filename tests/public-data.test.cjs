'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const base = path.join(__dirname, '..', 'data');
const load = name => JSON.parse(fs.readFileSync(path.join(base, name), 'utf8'));
const shadow = load('shadow_live_latest.json');
const plan = load('position_transition_plan.json');
assert.equal(shadow.execution_authorized, false, 'shadow execution must remain disabled');
assert.equal(plan.execution_authorized, false, 'plan execution must remain disabled');
assert.equal(shadow.adaptive_execution_authorized, false, 'adaptive execution must remain disabled');
assert.equal(shadow.public_schema_version, plan.public_schema_version, 'schema mismatch');
assert.equal(shadow.market_date, plan.market_date, 'session mismatch');
assert.match(shadow.market_date, /^\d{4}-\d{2}-\d{2}$/, 'invalid session date');
assert.equal(shadow.expected_latest_session, shadow.market_date, 'expected session mismatch');
assert(Number.isFinite(shadow.shadow_final_exposure) && shadow.shadow_final_exposure >= 0, 'invalid exposure');
assert(Number.isFinite(Date.parse(shadow.generated_at_utc)), 'invalid timestamp');
assert.equal(shadow.inputs_synchronized, true, 'unsynchronized inputs');
assert.equal(shadow.data_quality_warning, false, 'data quality warning');
assert.equal(shadow.freshness_status, 'CURRENT', 'publisher reported stale');
assert(Array.isArray(plan.conditional_transitions), 'conditional transitions missing');
for (const item of plan.conditional_transitions) {
  assert(typeof item.condition === 'string' && item.condition.length, 'transition condition missing');
  assert(Number.isFinite(item.target_core_exposure), 'invalid target');
  assert(Number.isFinite(item.delta_from_current), 'invalid delta');
}
console.log('Public JSON contract passed for session', shadow.market_date, '(publication age is checked in the browser)');
