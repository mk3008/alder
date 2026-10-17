from pathlib import Path
import json

fixture = json.loads(Path(__file__).with_name('meeting-room.json').read_text())
print('架空fixture: 未合意の草案（製品の実装・テストではない）')
print('構造: Activity / Why / When / Who / Where / Input / Procedure / Exception / Output / Result')
print(f"業務名: {fixture['activity']}")
print(f"Output: {fixture['output'][0]['information']}")
print(f"Result: {fixture['result']}")
for question in fixture['open']:
    print(f"未決 {question['id']}: {question['question']} decision={json.dumps(question['decision'])}")
for check in fixture['checks']:
    print(f"{check['id']}: {check['review_state']} / Test根拠={check['test_evidence']}")
print(f"System Design: DB={fixture['system_design']['database']}")
print(f"Code永続mapping: {str(fixture['permanent_code_mapping']).lower()}")
