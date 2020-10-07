import css from 'styled-jsx/css';

export default css.global`
  $card-height: 120px;
  $card-width: $card-height * 3/4;
  $card-margin: 5px;
  $grid-corner-size: $card-height + $card-margin * 2;
  $grid-template: $grid-corner-size calc(100% - #{$grid-corner-size * 2})
    $grid-corner-size;

  .local.big-two {
    @include sq-dimen(100%);
    display: grid;
    grid-template-columns: 50% 50%;

    &.num-of-player-3,
    &.num-of-player-4 {
      grid-template-rows: 50% 50%;
    }
  }

  .big-two-board {
    @include relative();
    @include sq-dimen(100%);
    display: grid;
    grid-template-columns: $grid-template;
    grid-template-rows: $grid-template;

    > * {
      //bottom
      &:nth-child(1) {
        grid-column: 2;
        grid-row: 3;
      }

      &.left {
        grid-column: 1;
        grid-row: 2;
      }

      &.top {
        grid-column: 2;
        grid-row: 1;
      }

      &.right {
        grid-column: 3;
        grid-row: 2;
      }

      &.center {
        @include flex(center, center);
        grid-column: 2;
        grid-row: 2;
        text-align: center;

        > div {
          @include dimen(100%);
        }

        .last-hand {
          @include dimen(100%);

          .cards {
            @include relative();
            height: $card-height;
            margin: auto;

            .card {
              @include absolute(0, null, 0);
            }
          }
        }

        .message {
          margin-top: 10px;
        }
      }

      &.my-deck {
        @include relative();

        .big-two-control {
          @include absolute(-15px);
          @include dimen(100%);
          @include flex(center, center);
          transform: translateY(-100%);
        }

        .cards {
          @include dimen(100%);
          margin: auto;
        }

        .card {
          @include absolute();
          transform-origin: center bottom;
        }
      }

      &.other-deck {
        &.top .cards,
        &.left .cards {
          img {
            @include absolute(0, null, 0);
          }
        }

        &.right .cards {
          img {
            @include absolute(0, null, null, 0);
          }
        }

        .cards {
          @include relative();
          margin: auto;
        }
      }
    }
  }
`;
