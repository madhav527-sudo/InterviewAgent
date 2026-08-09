"""
CohortIQ Question Bank
Organized by topic, difficulty, and question type.
Each question includes follow-up branches for adaptive interviewing.
"""

QUESTION_BANK = {
    "Prompt Engineering": {
        "curriculum_days": [2, 3, 4],
        "questions": [
            {
                "id": "pe_01",
                "text": "Can you explain the difference between zero-shot and few-shot prompting? When would you choose one over the other?",
                "difficulty": 2,
                "type": "conceptual",
                "day": 2,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "You mentioned few-shot prompting. How would you select and order your examples to maximize performance on a classification task?",
                        "difficulty": 3
                    },
                    {
                        "trigger": "weak",
                        "text": "Let's simplify — if you had no examples to give the model, what techniques could you use in your prompt to still get good results?",
                        "difficulty": 1
                    }
                ]
            },
            {
                "id": "pe_02",
                "text": "Walk me through how chain-of-thought prompting works. Why does asking a model to 'think step by step' actually improve its reasoning?",
                "difficulty": 3,
                "type": "conceptual",
                "day": 3,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "Interesting. Now, how would you combine chain-of-thought with self-consistency to get more reliable answers? What are the trade-offs?",
                        "difficulty": 4
                    },
                    {
                        "trigger": "mentions_tokens",
                        "text": "You brought up token usage. How would you balance the improved accuracy of CoT against the increased cost in a production system handling thousands of requests?",
                        "difficulty": 4
                    }
                ]
            },
            {
                "id": "pe_03",
                "text": "You're building a customer support bot. How would you design the system prompt to ensure it stays on-topic, handles edge cases, and maintains a consistent tone?",
                "difficulty": 3,
                "type": "practical",
                "day": 2,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you evaluate whether your prompt is actually working well? What metrics would you track?",
                        "difficulty": 4
                    },
                    {
                        "trigger": "mentions_guardrails",
                        "text": "You mentioned guardrails. How would you specifically prevent prompt injection attacks while keeping the bot helpful?",
                        "difficulty": 4
                    }
                ]
            },
            {
                "id": "pe_04",
                "text": "Explain prompt chaining. How does breaking a complex task into multiple prompts improve reliability compared to a single large prompt?",
                "difficulty": 3,
                "type": "conceptual",
                "day": 3,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "In a prompt chain, how do you handle errors or unexpected outputs from an intermediate step without restarting the entire chain?",
                        "difficulty": 4
                    }
                ]
            },
            {
                "id": "pe_05",
                "text": "How would you A/B test two different prompt strategies in production? What would your evaluation framework look like?",
                "difficulty": 4,
                "type": "practical",
                "day": 4,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "Beyond accuracy, how would you factor in latency, cost, and user satisfaction into your prompt evaluation? How do you weight these metrics?",
                        "difficulty": 5
                    }
                ]
            }
        ]
    },
    "RAG Architecture": {
        "curriculum_days": [5, 6, 7, 8, 9],
        "questions": [
            {
                "id": "rag_01",
                "text": "Explain what RAG is and why it was developed as an alternative to fine-tuning for knowledge-intensive tasks.",
                "difficulty": 2,
                "type": "conceptual",
                "day": 5,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "You mentioned retrieval. How would you improve retrieval quality if your RAG pipeline is returning irrelevant documents?",
                        "difficulty": 3
                    },
                    {
                        "trigger": "mentions_hallucination",
                        "text": "You brought up hallucination. How does RAG specifically reduce hallucination compared to a vanilla LLM, and where can it still fail?",
                        "difficulty": 3
                    }
                ]
            },
            {
                "id": "rag_02",
                "text": "Compare recursive character splitting, semantic chunking, and fixed-size chunking. When would each strategy be most appropriate?",
                "difficulty": 3,
                "type": "conceptual",
                "day": 6,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How does chunk size affect retrieval quality versus generation quality? Is there an optimal chunk size, or does it depend on the use case?",
                        "difficulty": 4
                    },
                    {
                        "trigger": "weak",
                        "text": "Let's focus on one: what is recursive character splitting and why is it a popular default choice?",
                        "difficulty": 2
                    }
                ]
            },
            {
                "id": "rag_03",
                "text": "Design a complete RAG pipeline for a legal document search system. Walk me through each component from document ingestion to response generation.",
                "difficulty": 4,
                "type": "system_design",
                "day": 8,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you handle documents that reference other documents, like legal citations? How does this affect your chunking and retrieval strategy?",
                        "difficulty": 5
                    },
                    {
                        "trigger": "misses_reranking",
                        "text": "You've covered retrieval, but how would re-ranking improve result quality? When is re-ranking worth the added latency?",
                        "difficulty": 4
                    }
                ]
            },
            {
                "id": "rag_04",
                "text": "Your RAG pipeline is returning relevant documents but the LLM's answers are still inaccurate. How would you debug this?",
                "difficulty": 4,
                "type": "debugging",
                "day": 9,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "You identified the issue. Now, how would you set up automated monitoring to catch this kind of quality regression before users report it?",
                        "difficulty": 5
                    }
                ]
            },
            {
                "id": "rag_05",
                "text": "What are the RAGAS evaluation metrics — faithfulness, answer relevancy, context precision, and context recall? How do they each measure different aspects of RAG quality?",
                "difficulty": 4,
                "type": "conceptual",
                "day": 14,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "If your faithfulness score is high but answer relevancy is low, what does that tell you about your pipeline, and how would you fix it?",
                        "difficulty": 5
                    }
                ]
            },
            {
                "id": "rag_06",
                "text": "Explain HyDE (Hypothetical Document Embeddings). How does generating a hypothetical answer before retrieval improve search quality?",
                "difficulty": 4,
                "type": "conceptual",
                "day": 15,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "What are the failure modes of HyDE? When would it actually make retrieval worse?",
                        "difficulty": 5
                    }
                ]
            }
        ]
    },
    "Vector Databases": {
        "curriculum_days": [10, 11, 12, 13],
        "questions": [
            {
                "id": "vdb_01",
                "text": "Explain how HNSW (Hierarchical Navigable Small World) indexing works. Why is it preferred for approximate nearest neighbor search?",
                "difficulty": 3,
                "type": "conceptual",
                "day": 10,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How does HNSW compare to IVF in terms of memory usage, build time, and query latency? When would you choose one over the other?",
                        "difficulty": 4
                    },
                    {
                        "trigger": "weak",
                        "text": "Let's start simpler — why can't we just use brute-force search to find the most similar vectors? What problem does indexing solve?",
                        "difficulty": 2
                    }
                ]
            },
            {
                "id": "vdb_02",
                "text": "You need to choose between Pinecone, Weaviate, ChromaDB, and FAISS for a project. What factors would drive your decision?",
                "difficulty": 3,
                "type": "practical",
                "day": 11,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "You're building a prototype that needs to scale to production. Would you start with ChromaDB and migrate later, or use Pinecone from day one? What's your migration strategy?",
                        "difficulty": 4
                    }
                ]
            },
            {
                "id": "vdb_03",
                "text": "Your vector search returns results in 500ms but you need sub-100ms. Walk me through your optimization strategy.",
                "difficulty": 4,
                "type": "debugging",
                "day": 13,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you implement metadata filtering alongside vector similarity without sacrificing performance? What's the trade-off between pre-filtering and post-filtering?",
                        "difficulty": 5
                    }
                ]
            },
            {
                "id": "vdb_04",
                "text": "Explain the difference between cosine similarity, Euclidean distance, and dot product for vector search. When does the choice of distance metric matter?",
                "difficulty": 3,
                "type": "conceptual",
                "day": 10,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "If your embeddings are already normalized, does the choice between cosine similarity and dot product matter? Why or why not?",
                        "difficulty": 4
                    }
                ]
            }
        ]
    },
    "Agentic AI": {
        "curriculum_days": [17, 18, 19],
        "questions": [
            {
                "id": "agent_01",
                "text": "Explain the ReAct pattern for AI agents. How does combining reasoning and acting in an interleaved manner improve agent performance?",
                "difficulty": 3,
                "type": "conceptual",
                "day": 17,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "What happens when a ReAct agent gets stuck in a reasoning loop? How would you detect and handle this in production?",
                        "difficulty": 4
                    },
                    {
                        "trigger": "weak",
                        "text": "Let's step back — what's the difference between an AI agent and a simple prompt-response system? What makes something 'agentic'?",
                        "difficulty": 2
                    }
                ]
            },
            {
                "id": "agent_02",
                "text": "Design a tool-calling system where an AI agent can search the web, query a database, and send emails. How do you define the tools and handle errors?",
                "difficulty": 4,
                "type": "system_design",
                "day": 18,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you implement parallel tool execution when the agent needs results from multiple tools simultaneously? What are the risks?",
                        "difficulty": 5
                    }
                ]
            },
            {
                "id": "agent_03",
                "text": "How would you implement memory for a long-running AI agent that needs to remember context from hundreds of previous interactions?",
                "difficulty": 4,
                "type": "practical",
                "day": 19,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How do you decide what to keep in short-term versus long-term memory? What's your eviction strategy when context window limits are reached?",
                        "difficulty": 5
                    }
                ]
            }
        ]
    },
    "MCP": {
        "curriculum_days": [20, 21, 22],
        "questions": [
            {
                "id": "mcp_01",
                "text": "What is the Model Context Protocol (MCP) and what problem does it solve in the AI ecosystem?",
                "difficulty": 2,
                "type": "conceptual",
                "day": 20,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How does MCP differ from traditional API integrations? What advantages does the protocol offer for AI tool interoperability?",
                        "difficulty": 3
                    }
                ]
            },
            {
                "id": "mcp_02",
                "text": "Design an MCP server that exposes a PostgreSQL database to AI assistants. What resources, tools, and prompts would you expose?",
                "difficulty": 4,
                "type": "system_design",
                "day": 20,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you handle security in your MCP server? What prevents an AI from running destructive SQL queries?",
                        "difficulty": 5
                    }
                ]
            },
            {
                "id": "mcp_03",
                "text": "Explain how multi-agent orchestration works. How do you coordinate multiple AI agents to work on different parts of a problem?",
                "difficulty": 4,
                "type": "conceptual",
                "day": 22,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "What happens when two agents in a multi-agent system disagree? How do you implement consensus or conflict resolution?",
                        "difficulty": 5
                    }
                ]
            }
        ]
    },
    "AI Deployment": {
        "curriculum_days": [26, 27, 28, 29],
        "questions": [
            {
                "id": "deploy_01",
                "text": "You need to deploy a RAG application to production. Walk me through the infrastructure and architecture decisions you'd make.",
                "difficulty": 4,
                "type": "system_design",
                "day": 27,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you handle a 10x traffic spike? What would your auto-scaling strategy look like for the different components?",
                        "difficulty": 5
                    },
                    {
                        "trigger": "weak",
                        "text": "Let's start with the basics — what's the simplest way to deploy a FastAPI-based AI application so others can access it?",
                        "difficulty": 2
                    }
                ]
            },
            {
                "id": "deploy_02",
                "text": "How would you implement rate limiting and cost controls for an AI API that calls OpenAI under the hood?",
                "difficulty": 4,
                "type": "practical",
                "day": 28,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you implement a token budget system where each user has a monthly allocation? How do you handle mid-request budget exhaustion?",
                        "difficulty": 5
                    }
                ]
            },
            {
                "id": "deploy_03",
                "text": "What would you monitor in a production AI system? What metrics and alerts would you set up?",
                "difficulty": 3,
                "type": "practical",
                "day": 29,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you detect model quality degradation over time? What's different about monitoring AI systems compared to traditional software?",
                        "difficulty": 4
                    }
                ]
            }
        ]
    },
    "LangChain & LangGraph": {
        "curriculum_days": [23, 24, 25],
        "questions": [
            {
                "id": "lc_01",
                "text": "Explain LCEL (LangChain Expression Language). How does it change the way you compose LLM applications compared to traditional chains?",
                "difficulty": 3,
                "type": "conceptual",
                "day": 23,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you implement error handling and retry logic in an LCEL chain? What happens when one step in the chain fails?",
                        "difficulty": 4
                    }
                ]
            },
            {
                "id": "lc_02",
                "text": "Design a LangGraph workflow for an AI agent that can research a topic, write content, review it, and either approve or send it back for revision.",
                "difficulty": 4,
                "type": "system_design",
                "day": 24,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How would you add human-in-the-loop approval at the review stage? How does LangGraph's checkpointing help with this?",
                        "difficulty": 5
                    }
                ]
            }
        ]
    },
    "Production AI Systems": {
        "curriculum_days": [16, 28, 29, 30, 31],
        "questions": [
            {
                "id": "prod_01",
                "text": "What's the difference between building an AI prototype and making it production-ready? What are the top 5 things that change?",
                "difficulty": 3,
                "type": "conceptual",
                "day": 30,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "You mentioned testing. How do you write tests for non-deterministic AI systems? What does a CI/CD pipeline look like for an LLM application?",
                        "difficulty": 5
                    }
                ]
            },
            {
                "id": "prod_02",
                "text": "Design a caching strategy for an AI application. What layers of caching would you implement and where?",
                "difficulty": 4,
                "type": "system_design",
                "day": 16,
                "follow_ups": [
                    {
                        "trigger": "good",
                        "text": "How do you handle cache invalidation when the underlying knowledge base is updated? What's your strategy for balancing freshness versus performance?",
                        "difficulty": 5
                    }
                ]
            }
        ]
    }
}


def get_questions_for_topic(topic: str) -> list:
    """Get all questions for a specific topic."""
    if topic in QUESTION_BANK:
        return QUESTION_BANK[topic]["questions"]
    return []


def get_question_by_id(question_id: str) -> dict | None:
    """Find a question by its ID across all topics."""
    for topic_data in QUESTION_BANK.values():
        for q in topic_data["questions"]:
            if q["id"] == question_id:
                return q
    return None


def get_topics() -> list[str]:
    """Get all available topics."""
    return list(QUESTION_BANK.keys())


def get_questions_by_difficulty(difficulty: int) -> list:
    """Get all questions at a specific difficulty level."""
    results = []
    for topic, data in QUESTION_BANK.items():
        for q in data["questions"]:
            if q["difficulty"] == difficulty:
                results.append({**q, "topic": topic})
    return results


def get_curriculum_days_for_topic(topic: str) -> list[int]:
    """Get which curriculum days a topic covers."""
    if topic in QUESTION_BANK:
        return QUESTION_BANK[topic]["curriculum_days"]
    return []

def get_topic_guidance(topics: list[str], difficulty: str = "adaptive") -> str:
    """Generate topic guidance text for the AI interviewer prompt.
    Returns a structured summary of available topics and question areas."""
    guidance_parts = []
    diff_map = {"easy": [1, 2], "medium": [2, 3], "hard": [4, 5], "adaptive": [1, 2, 3, 4, 5]}
    target_levels = diff_map.get(difficulty, [1, 2, 3, 4, 5])
    
    for topic in topics:
        if topic not in QUESTION_BANK:
            continue
        topic_data = QUESTION_BANK[topic]
        questions = topic_data.get("questions", [])
        # Get question types and areas at appropriate difficulty
        areas = set()
        q_types = set()
        for q in questions:
            if q.get("difficulty", 3) in target_levels or difficulty == "adaptive":
                q_types.add(q.get("type", "conceptual"))
                # Extract key concepts from question text
                text = q.get("text", "")
                areas.add(text[:80])  # First 80 chars as a hint
        
        if areas:
            guidance_parts.append(
                f"**{topic}** (Curriculum Days: {topic_data.get('curriculum_days', [])}):\n"
                f"  Question types: {', '.join(q_types)}\n"
                f"  Example areas: {'; '.join(list(areas)[:3])}"
            )
    
    return "\n".join(guidance_parts) if guidance_parts else "General technical interview topics."
