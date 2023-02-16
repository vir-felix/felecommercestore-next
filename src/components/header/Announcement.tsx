import type { Announcement as AnnouncementType } from "@prisma/client";

import { useEffect, useState } from "react";
import { BsXLg } from "react-icons/bs";
import { MoonLoader } from "react-spinners";
import sanitizeHtml from "sanitize-html";

import Modal from "@Components/Modal";

import {
  DialogType,
  useAnnouncementState,
  useDialog,
} from "@Contexts/UIContext";
import { setCookie } from "src/utils";
import { allowedTags } from "src/constants";

export default function Announcement() {
  const [announcementVisible, setAnnouncementVisible] = useAnnouncementState();
  const [content, setContent] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(true);

  const { currentDialog, setDialog } = useDialog();
  const [currentDetails, setCurrentDetails] = useState("");
  const visible = currentDialog == DialogType.MODAL_ANNOUNCEMENT;

  const handleClose = () => {
    setAnnouncementVisible(false);
    setCookie("announcementState", "closed", 14);
  };

  const announcementBody = content?.map(({ headline, details }) => (
    <div
      key={headline}
      className="announcement__inner"
      onClickCapture={(e) => {
        e.preventDefault();
        setCurrentDetails(details);
      }}
    >
      <span
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(headline, { allowedTags: [...allowedTags] }),
        }}
      ></span>
    </div>
  ));

  useEffect(() => {
    if (currentDetails) {
      setDialog(DialogType.MODAL_ANNOUNCEMENT);
    } else {
      setDialog(null);
    }
  }, [currentDetails, setDialog]);

  useEffect(() => {
    if (announcementVisible) {
      fetch("/api/announcement")
        .then((res) => res.json())
        .then(({ data }: { data: AnnouncementType[] }) => setContent(data))
        .catch()
        .finally(() => setLoading(false));
    }
  }, [announcementVisible]);

  if ((!content || !content.length) && !loading) {
    return null;
  }

  return (
    <div
      className={`announcement${
        !announcementVisible ? " announcement--hidden" : ""
      }`}
    >
      <div className="announcement__container">
        {content.length ? (
          <div
            style={{ width: `${content.length * 100}%` }}
            className="announcement__content"
          >
            {[...Array(2)].map((_, i) => (
              <div key={i} className="announcement__marquee">
                {announcementBody}
              </div>
            ))}
          </div>
        ) : (
          <div className="announcement__loader">
            <MoonLoader size={22} className="announcement__loader-spinner" />
          </div>
        )}

        <button
          aria-label="close announcement banner"
          onClick={handleClose}
          className="announcement__close"
        >
          <BsXLg className="announcement__close-icon" />
        </button>

        <Modal
          size="sm"
          onClose={() => setCurrentDetails("")}
          visible={visible}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(currentDetails, {
                allowedTags: [...allowedTags, "a"],
              }),
            }}
          ></div>
        </Modal>
      </div>
    </div>
  );
}
