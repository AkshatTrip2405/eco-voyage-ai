"use client";

import { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  Toast,
  Loader,
  ThemeToggle,
} from "@/components/ui";

export default function ComponentsDemo() {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
  if (showToast) {
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [showToast]);

  return (
    <div className="min-h-screen p-10 space-y-6">
      <h1 className="text-3xl font-bold">Component Showcase</h1>
      <ThemeToggle />

      {/* Buttons */}
      <div className="flex gap-3 flex-wrap">
        <Button
          variant="primary"
          onClick={() => alert("Primary Button Clicked")}
        >
          Primary Button
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowModal(true)}
        >
          Open Modal
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowToast(true)}
        >
          Show Toast
        </Button>
      </div>

      {/* Input */}
      <Input
        label="Email"
        placeholder="Enter your email"
      />

      {/* Loader */}
      <div>
        <h2 className="font-semibold mb-2">Loader Component</h2>
        <Loader />
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Demo Modal"
      >
        <p>This is a reusable modal component.</p>
      </Modal>

      {/* Toast */}
      {showToast && (
        <Toast message="Component library demo completed successfully!" />
      )}
    </div>
  );
}