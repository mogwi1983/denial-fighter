# Fake Appeal Cases For Development

Last reviewed: 2026-04-29

Use these fixtures for local testing, demos, and prompt iteration. They are fictional and intentionally avoid real PHI.

## Case 1: Lumbar MRI Denial

Suggested payer: `ExampleCare Medicare Advantage`

Suggested diagnosis: `Lumbar radiculopathy`

Denial notice:

```txt
ExampleCare Medicare Advantage
Notice of Denial of Medical Coverage

Member: Test Patient A
Member ID: TEST-MEMBER-001
Claim ID: TEST-CLAIM-1001

We denied authorization for MRI lumbar spine without contrast. The request is denied because the documentation provided does not show six weeks of provider-directed conservative treatment within the last three months. The notes also do not document objective neurologic deficit or red-flag symptoms.

You may appeal this decision by submitting additional records that show medical necessity, including physical therapy notes, medication trials, exam findings, and any worsening symptoms.
```

Chart notes:

```txt
Patient A is a fictional 68-year-old with eight weeks of low back pain radiating down the left leg. Conservative treatment included naproxen, home exercise program, and four physical therapy visits with limited improvement. Exam shows positive straight leg raise on the left, decreased left ankle reflex, and reduced sensation over the lateral foot. No bowel or bladder symptoms. MRI requested to evaluate suspected L5-S1 nerve root compression and guide next treatment.
```

Expected appeal focus:

- Conservative therapy was attempted and documented.
- Objective neurologic findings are present.
- MRI is needed to guide treatment, not as routine screening.

## Case 2: Skilled Nursing Facility Stay Denial

Suggested payer: `SampleHealth MA Plan`

Suggested diagnosis: `Post-operative weakness after hip fracture repair`

Denial notice:

```txt
SampleHealth MA Plan
Coverage Determination

Member: Test Patient B
Member ID: TEST-MEMBER-002
Authorization ID: TEST-AUTH-2002

We denied continued skilled nursing facility care from day 8 forward. The records submitted do not show that the member requires daily skilled nursing or therapy services. Custodial care is not covered.

Please submit therapy progress notes, nursing documentation, functional status, and discharge safety concerns if you disagree with this decision.
```

Chart notes:

```txt
Patient B is a fictional 76-year-old recovering from right hip fracture repair. Patient requires moderate assistance for transfers and ambulation with walker for 25 feet. Physical therapy documents impaired balance, high fall risk, and inability to safely climb three steps required to enter home. Nursing notes document wound monitoring and medication adjustment after post-operative hypotension. Discharge home is not safe without further daily skilled therapy.
```

Expected appeal focus:

- Daily skilled therapy need is tied to measurable functional limits.
- Wound monitoring and medication adjustment support skilled nursing need.
- Unsafe discharge supports continued covered care.

## Case 3: GLP-1 Medication Denial

Suggested payer: `Metro Senior Advantage`

Suggested diagnosis: `Type 2 diabetes mellitus with hyperglycemia`

Denial notice:

```txt
Metro Senior Advantage
Prescription Drug Coverage Denial

Member: Test Patient C
Member ID: TEST-MEMBER-003
Case ID: TEST-RX-3003

We denied coverage for semaglutide because the information submitted does not show the patient tried and failed preferred formulary alternatives. The request also does not include recent A1c documentation.

You may appeal with medication history, contraindications, and recent lab values supporting medical necessity.
```

Chart notes:

```txt
Patient C is a fictional 71-year-old with type 2 diabetes. Recent A1c is 9.1 despite metformin and basal insulin. Patient previously stopped glipizide due to recurrent symptomatic hypoglycemia. Patient has chronic kidney disease stage 3, making medication selection more limited. Semaglutide requested for improved glycemic control and lower hypoglycemia risk.
```

Expected appeal focus:

- Preferred alternative was not tolerated.
- Recent A1c supports need for escalation.
- Comorbid kidney disease and hypoglycemia history support selected therapy.

## How To Use These Cases

1. Open `/tool`.
2. Choose `Paste Text`.
3. Paste one denial notice and its matching chart notes.
4. Fill in the suggested payer and diagnosis.
5. Generate an appeal.
6. Confirm the result includes payer, denial reason, evidence needed, evidence covered, evidence gaps, and the appeal letter.

Never use real patient records during development.
