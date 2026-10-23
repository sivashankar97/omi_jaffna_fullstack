ALTER TABLE content_items DROP CONSTRAINT IF EXISTS content_items_type_check;
ALTER TABLE content_items ADD CONSTRAINT content_items_type_check CHECK (type IN ('page','ministry','parish','formation','location','leadership','international','news','event','publication','media','school','timeline','priest','bishop','necrology'));
