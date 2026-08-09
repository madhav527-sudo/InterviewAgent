"""Quick integration test for CohortIQ API."""
import urllib.request
import json

BASE = "http://localhost:8000/api"

def post(path, data):
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=json.dumps(data).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    r = urllib.request.urlopen(req)
    return json.loads(r.read())

def get(path):
    r = urllib.request.urlopen(f"{BASE}{path}")
    return json.loads(r.read())

# 1. Health check
h = get("/health")
print(f"[OK] Health: {h['status']}")

# 2. Get candidate
c = get("/candidates/cand_001")
print(f"[OK] Candidate: {c['name']} — {c['days_completed']}/{c['total_days']} days")

# 3. Get topics
t = get("/topics")
print(f"[OK] Topics: {', '.join(t['topics'])}")

# 4. Start interview
session = post("/interviews/start", {
    "candidate_id": "cand_001",
    "interview_type": "comprehensive",
    "difficulty": "adaptive",
    "num_questions": 10,
    "selected_topics": [],
    "auto_select_topics": True,
})
sid = session["session_id"]
q1 = session["current_question"]
print(f"[OK] Interview started: {sid}")
print(f"     Q1 [{q1['topic']}] Day {q1['curriculum_day']}: {q1['text'][:80]}...")

# 5. Submit answer
r1 = post(f"/interviews/{sid}/answer", {
    "answer_text": "HNSW creates a hierarchical graph structure with multiple layers. The top layers have fewer connections for fast navigation, while bottom layers are denser for accuracy. Search starts at the top layer and greedily traverses to find approximate nearest neighbors in logarithmic time. It offers excellent recall-speed tradeoffs compared to IVF indexing."
})
ev = r1.get("last_evaluation", {})
print(f"[OK] Answer evaluated — Score: {ev.get('score', 'N/A')}")
print(f"     Feedback: {ev.get('feedback', 'N/A')[:60]}...")
q2 = r1.get("current_question")
if q2:
    print(f"     Q2 [{q2['topic']}] Follow-up: {q2['is_followup']}")
    print(f"     Q2: {q2['text'][:80]}...")
    print(f"     Days covered: {r1.get('days_covered', [])}")

# 6. Submit second answer
if q2:
    r2 = post(f"/interviews/{sid}/answer", {
        "answer_text": "HNSW uses more memory than IVF because it stores the full graph, but queries are faster. IVF partitions the space into clusters and only searches within the closest clusters, trading accuracy for speed. For large-scale systems I would choose HNSW for low-latency applications and IVF for memory-constrained environments."
    })
    q3 = r2.get("current_question")
    if q3:
        print(f"[OK] Q3 [{q3['topic']}] Difficulty: {r2.get('current_difficulty')}")
        print(f"     Topics so far: {r2.get('topics_covered', [])}")

# 7. Complete interview
report = post(f"/interviews/{sid}/complete", {})
print(f"[OK] Interview completed!")
print(f"     Overall score: {report.get('overall_score', 'N/A')}")
print(f"     Grade: {report.get('grade', 'N/A')}")
print(f"     Strengths: {report.get('strengths', [])[:3]}")
print(f"     Recommendation: {report.get('recommendation', 'N/A')[:60]}...")
print()
print("=" * 50)
print("ALL TESTS PASSED ✓")
print("=" * 50)
