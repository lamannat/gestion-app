import { Router } from "express";
import supabase from "../db/supabase.js";

const router = Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error.message);
    return res.status(500).json({ error: "Could not fetch tasks" });
  }

  res.json(data);
});

router.post("/", async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({ title: title.trim() })
    .select()
    .single();

  if (error) {
    console.error("Error creating task:", error.message);
    return res.status(500).json({ error: "Could not create task" });
  }

  res.status(201).json(data);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  const { data, error } = await supabase
    .from("tasks")
    .update({ done })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating task:", error.message);
    return res.status(500).json({ error: "Could not update task" });
  }

  res.json(data);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error.message);
    return res.status(500).json({ error: "Could not delete task" });
  }

  res.status(204).send();
});

export default router;
