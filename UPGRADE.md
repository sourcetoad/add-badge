# Upgrade Guide

## v2

### Upgrading from 1.x to 2.0

> [!TIP]
> Upgrade to `1.1` first. It behaves identically to `1.0` but prints a
> deprecation warning showing the equivalent `2.0` command for your
> options.

- Minimum Node version increased from `v20` to `v22.12`.
- The `add-badges` command was removed; `add-badge` now handles globs.
- Positional arguments were replaced with named options:

| v1                                          | v2                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------- |
| `add-badge in.png out.png "TEXT" [options]` | `add-badge --input in.png --output out.png --text "TEXT" [options]` |
| `add-badges "<glob>" "TEXT" [options]`      | `add-badge --input "<glob>" --text "TEXT" [options]`                |

## v1

### Upgrading from v0.9 to 1.0

- Minimum Node version increased from `v18` to `v20`.
