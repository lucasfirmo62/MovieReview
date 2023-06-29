import React from "react";
import Publication from "./Publication";

const PublicationList = ({ publications, idUser }) => {
  return (
    <div className="publication-list">
      {publications.map((publication) => (
        <Publication
          key={publication.id}
          publication={publication}
          idUser={idUser}
        />
      ))}
    </div>
  );
};

export default PublicationList;