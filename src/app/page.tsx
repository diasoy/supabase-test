/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from "@/components/ui/toast";

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastContent, setToastContent] = useState<{
    title: string;
    description: string;
    status: "default" | "destructive" | "success" | null | undefined;
  }>({
    title: "",
    description: "",
    status: "default",
  });

  const fetchNotes = async () => {
    const { data, error } = await supabase.from("Note").select("*");
    if (error) {
      console.error("Error fetching notes:", error);
    } else {
      setNotes(data);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("Note").insert([{ title, body }]);
    if (error) {
      console.error("Error creating note:", error);
    } else {
      setTitle("");
      setBody("");
      fetchNotes();
      setToastContent({
        title: "Catatan berhasil ditambahkan",
        description: "Catatan baru telah berhasil ditambahkan.",
        status: "success",
      });
      setToastVisible(true);
    }
  };

  const handleDeleteNote = async (id: number) => {
    const { error } = await supabase.from("Note").delete().eq("id", id);
    if (error) {
      console.error("Error deleting note:", error);
    } else {
      fetchNotes();
      setToastContent({
        title: "Catatan berhasil dihapus",
        description: "Catatan telah berhasil dihapus.",
        status: "success",
      });
      setToastVisible(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center mt-32">
        <header>
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>CatatanQ</CardTitle>
              <CardDescription>
                Buat catatan baru untuk proyekmu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateNote}>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="title">Judul</Label>
                    <Input
                      id="title"
                      placeholder="Name of your project"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="body">Isi Catatan</Label>
                    <Input
                      id="body"
                      placeholder="Body of your project"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </div>
                </div>
                <CardFooter className="flex justify-center">
                  <Button type="submit">Tambah</Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </header>
        <main>
          <Card>
            <CardHeader>
              <CardTitle>Daftar Catatan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-4 gap-4">
                {notes.map((note) => (
                  <li key={note.id}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{note.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{note.body}</p>
                      </CardContent>
                      <CardFooter>
                        <Button>Edit</Button>
                        <Button onClick={() => handleDeleteNote(note.id)}>
                          Hapus
                        </Button>
                      </CardFooter>
                    </Card>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
      <ToastProvider>
        {toastVisible && (
          <Toast variant={toastContent.status}>
            <ToastTitle>{toastContent.title}</ToastTitle>
            <ToastDescription>{toastContent.description}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </ToastProvider>
    </>
  );
}
