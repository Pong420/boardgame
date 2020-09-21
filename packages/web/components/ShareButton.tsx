import React, { useRef, MouseEvent, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Classes,
  Dialog,
  IButtonProps
} from '@blueprintjs/core';
import { ButtonPopover } from './ButtonPopover';
import { Input } from './Input';
import WhatsappIcon from '../assets/iconmonstr-whatsapp-1.svg';
import TelegramIcon from '../assets/iconmonstr-telegram-4.svg';
import { useBoolean } from '@/hooks/useBoolean';

interface Props {
  name: string;
  matchID: string;
  playerName: string;
  gameName: string;
}

const buttonStyle = { fontSize: 18 };

function CopyButton({ onClick, ...props }: IButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef(setTimeout(() => void 0, 0));

  return (
    <Button
      {...props}
      intent="primary"
      text={copied ? 'Copied' : 'Copy'}
      style={{ minWidth: 60 }}
      disabled={typeof document === 'undefined' || !('execCommand' in document)}
      onClick={(event: MouseEvent<HTMLElement>) => {
        if (onClick) {
          onClick(event);
          clearTimeout(timeout.current);
          timeout.current = setTimeout(() => setCopied(false), 500);
          setCopied(true);
        }
      }}
    />
  );
}

export function ShareButton({ playerName, gameName, matchID, name }: Props) {
  const [isOpen, openDialog, closeDialog] = useBoolean();
  const url = `${window.location.origin}/invitation/${name}/${matchID}`;
  const text = `${playerName} inviate you to join the ${gameName} match`;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <ButtonPopover
        className="share-button"
        icon="share"
        content="Share"
        onClick={openDialog}
        minimal
      />
      <Dialog title="Share" isOpen={isOpen} onClose={closeDialog}>
        <div className={Classes.DIALOG_BODY}>
          <Input
            value={url}
            onChange={() => {
              /**/
            }}
            inputRef={inputRef}
            rightElement={
              <CopyButton
                text="Copy"
                onClick={() => {
                  inputRef.current?.select();
                  inputRef.current?.setSelectionRange(0, 99999);
                  document.execCommand('copy');
                  inputRef.current?.blur();
                }}
              />
            }
          />

          <div style={{ margin: '10px 0px' }} />

          <ButtonGroup fill>
            <Button
              style={buttonStyle}
              icon={<WhatsappIcon />}
              onClick={() =>
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(
                    text + '\n' + url
                  )}`,
                  '_blank'
                )
              }
            />
            <Button
              style={buttonStyle}
              icon={<TelegramIcon />}
              onClick={() =>
                window.open(
                  `https://t.me/share/url?url=${url}&text=${text}`,
                  '_blank'
                )
              }
            />
          </ButtonGroup>
        </div>
      </Dialog>
    </>
  );
}
