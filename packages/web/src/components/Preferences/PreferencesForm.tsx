import React, { useEffect, ReactNode } from 'react';
import { Tooltip } from '@blueprintjs/core';
import { Switch } from '@/components/Input';
import { createForm } from '@/utils/form';
import {
  Theme,
  PreferencesState,
  preferencesStorage,
  usePreferencesAction
} from '@/services';
import { ThemeSwitch } from './ThemeSwitch';
import { ScreenWidthSelect } from './ScreenWidthSelect';
import { PlayerNameControl } from '../PlayerNameControl';

interface Strore extends PreferencesState {
  theme: Theme;
  playerName: string;
}

const { Form, FormItem, useForm } = createForm<Strore>();

const Row: React.FC<{ label?: ReactNode }> = ({ label, children }) => (
  <div className="preferences-row">
    <div className="preferences-row-label">{label}</div>
    <div className="preferences-row-value">{children}</div>
  </div>
);

export function PreferencesForm() {
  const [form] = useForm();
  const updatePreferences = usePreferencesAction();

  useEffect(() => {
    form.setFieldsValue(preferencesStorage.get());
  }, [form]);

  return (
    <Form
      form={form}
      className="preferences-form"
      onValuesChange={changes =>
        updatePreferences(state => ({ ...state, ...changes }))
      }
    >
      <div className="preferences-section" data-type="Lobby">
        <Row label="Your Name">
          <FormItem name="playerName" noStyle>
            <PlayerNameControl minimal />
          </FormItem>
        </Row>

        <Row
          label={
            <Tooltip content="Automatically refresh lobby every 5 seconds">
              Polling
            </Tooltip>
          }
        >
          <FormItem name="polling" valuePropName="checked" noStyle>
            <Switch large />
          </FormItem>
        </Row>
      </div>

      <div className="preferences-section" data-type="Appearence">
        <Row label="Dark Mode">
          <FormItem name="theme" noStyle>
            <ThemeSwitch large />
          </FormItem>
        </Row>

        <Row label="Screen Width">
          <FormItem name="screenWidth" noStyle>
            <ScreenWidthSelect minimal />
          </FormItem>
        </Row>
      </div>
    </Form>
  );
}
