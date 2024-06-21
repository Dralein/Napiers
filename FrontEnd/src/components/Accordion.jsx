import { useState } from "react";
import styled from "styled-components";
import { PiPlusBold, PiMinusBold } from "react-icons/pi";
import PropTypes from "prop-types";

const AccordionSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: solid;
  border-color: rgb(242, 231, 206);
  border-width: 1px 0 0 0;
`;

const AccordionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 24px 0px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(242, 231, 206, 0.3);
  }
`;

const AccordionContent = styled.div`
  max-height: ${({ $isOpen }) => ($isOpen ? "200px" : "0")};
  opacity: ${({ $isOpen }) => ($isOpen ? "1" : "0")};
  overflow: hidden;
  transition: max-height 0.5s ease, opacity 0.5s ease, padding 0.5s ease;
  padding: ${({ $isOpen }) => ($isOpen ? "16px 0" : "0")};
`;

const AccordionIcon = styled.div`
  font-size: 1.2rem;
`;

const AccordionItem = ({ title, content, titleClassName }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionSection className={titleClassName}>
      <AccordionTitle onClick={toggleAccordion}>
        <p className="h4">{title}</p>
        <AccordionIcon>
          {isOpen ? (
            <PiMinusBold color="rgb(16, 56, 52)" />
          ) : (
            <PiPlusBold color="rgb(16, 56, 52)" />
          )}
        </AccordionIcon>
      </AccordionTitle>
      <AccordionContent $isOpen={isOpen}>{content}</AccordionContent>
    </AccordionSection>
  );
};

AccordionItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  titleClassName: PropTypes.string,
};

export default AccordionItem;
