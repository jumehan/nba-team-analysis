import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col, Row } from "reactstrap";
import nbaApi from "../api/nbaApi";
import nbaData from "../api/nbaData";
import PlayerProfileCard from "../components/ui-components/PlayerProfileCard";
import PlayerProfileList from "../components/ui-components/PlayerProfileList";
import PlayerShootingStatsTable from "../components/ui-components/PlayerShootingStatsTable";
import PlayerTeamCard from "../components/ui-components/PlayerTeamCard";
import { PlayerDetailsData } from "../types/playerDetails";
import { PlayerStatsData } from "../types/playerStats";
import { Row as R } from "react-table";
import GlossaryList from "../components/ui-components/GlossaryList";

interface PlayerProfile {
  details?: PlayerDetailsData;
  stats?: PlayerStatsData[];
  personId?: string;
  isLoading: boolean;
}

/**  */
function PlayerProfile() {
  const [player, setPlayer] = useState<PlayerProfile>({
    details: undefined,
    stats: undefined,
    personId: undefined,
    isLoading: true,
  });
  const { id } = useParams();
  const season = "2022";

  useEffect(
    function fetchPlayerDetail() {
      async function fetchPlayer() {
        const playerDetails = await nbaApi.getPlayerDetails(id || "2855");
        const playerStats = await nbaApi.getPlayerStats(id || "2855", season);
        const personId = nbaData.getPlayerId(
          playerDetails?.response[0].firstname,
          playerDetails?.response[0].lastname
        );
        setPlayer({
          details: playerDetails.response[0],
          stats: playerStats.response,
          personId: personId,
          isLoading: false,
        });
      }
      fetchPlayer();
    },
    [id]
  );

  const renderRowSubComponent = (row: R<PlayerStatsData>) => {
    const {
      game: { id },
    } = row.original;
    return <h5>{id}</h5>;
  };

  if (player.isLoading || !player.details || !player.personId || !player.stats)
    return <i>Loading...</i>;

  return (
    <React.Fragment>
      <Row className="align-items-start">
        <Col sm="4" className="px-2">
          <PlayerProfileCard player={player.details} id={player.personId} />
        </Col>
        <Col className="px-2" sm="8">
          <PlayerTeamCard team={player.stats[0].team} player={player.details} />
          <PlayerProfileList player={player.details} />
        </Col>
        <PlayerShootingStatsTable
          data={player.stats}
          season={season}
          renderRowSubComponent={renderRowSubComponent}
        />
      </Row>
      <hr />
      <GlossaryList />
    </React.Fragment>
  );
}

export default PlayerProfile;
