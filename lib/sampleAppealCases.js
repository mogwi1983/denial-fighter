export const sampleAppealCases = [
  {
    id: 'lumbar-mri-denial',
    title: 'Lumbar MRI denial',
    payerName: 'ExampleCare Medicare Advantage',
    patientDiagnosis: 'Lumbar radiculopathy',
    denialText: `ExampleCare Medicare Advantage
Notice of Denial of Medical Coverage

Member: Test Patient A
Member ID: TEST-MEMBER-001
Claim ID: TEST-CLAIM-1001

We denied authorization for MRI lumbar spine without contrast. The request is denied because the documentation provided does not show six weeks of provider-directed conservative treatment within the last three months. The notes also do not document objective neurologic deficit or red-flag symptoms.

You may appeal this decision by submitting additional records that show medical necessity, including physical therapy notes, medication trials, exam findings, and any worsening symptoms.`,
    chartNotes: `Patient A is a fictional 68-year-old with eight weeks of low back pain radiating down the left leg. Conservative treatment included naproxen, home exercise program, and four physical therapy visits with limited improvement. Exam shows positive straight leg raise on the left, decreased left ankle reflex, and reduced sensation over the lateral foot. No bowel or bladder symptoms. MRI requested to evaluate suspected L5-S1 nerve root compression and guide next treatment.`,
  },
  {
    id: 'snf-stay-denial',
    title: 'Skilled nursing stay denial',
    payerName: 'SampleHealth MA Plan',
    patientDiagnosis: 'Post-operative weakness after hip fracture repair',
    denialText: `SampleHealth MA Plan
Coverage Determination

Member: Test Patient B
Member ID: TEST-MEMBER-002
Authorization ID: TEST-AUTH-2002

We denied continued skilled nursing facility care from day 8 forward. The records submitted do not show that the member requires daily skilled nursing or therapy services. Custodial care is not covered.

Please submit therapy progress notes, nursing documentation, functional status, and discharge safety concerns if you disagree with this decision.`,
    chartNotes: `Patient B is a fictional 76-year-old recovering from right hip fracture repair. Patient requires moderate assistance for transfers and ambulation with walker for 25 feet. Physical therapy documents impaired balance, high fall risk, and inability to safely climb three steps required to enter home. Nursing notes document wound monitoring and medication adjustment after post-operative hypotension. Discharge home is not safe without further daily skilled therapy.`,
  },
  {
    id: 'glp1-medication-denial',
    title: 'GLP-1 medication denial',
    payerName: 'Metro Senior Advantage',
    patientDiagnosis: 'Type 2 diabetes mellitus with hyperglycemia',
    denialText: `Metro Senior Advantage
Prescription Drug Coverage Denial

Member: Test Patient C
Member ID: TEST-MEMBER-003
Case ID: TEST-RX-3003

We denied coverage for semaglutide because the information submitted does not show the patient tried and failed preferred formulary alternatives. The request also does not include recent A1c documentation.

You may appeal with medication history, contraindications, and recent lab values supporting medical necessity.`,
    chartNotes: `Patient C is a fictional 71-year-old with type 2 diabetes. Recent A1c is 9.1 despite metformin and basal insulin. Patient previously stopped glipizide due to recurrent symptomatic hypoglycemia. Patient has chronic kidney disease stage 3, making medication selection more limited. Semaglutide requested for improved glycemic control and lower hypoglycemia risk.`,
  },
];
