// preview page for newly created UI components

import Skeleton from "@/components/Skeleton"
import Avatar from "@/components/Avatar"

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>

      <h3>Skeleton</h3>
      <div className="preview-grid">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>

      <h3>Avatar</h3>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <Avatar name="alice" />
        <Avatar name="John" />
        <Avatar name="PocketHeist" />
        <Avatar name="DanielCraig" />
      </div>
    </div>
  )
}
